const mongoose = require("mongoose");
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const Coupon = require("../../../models/Coupon");
const StockLog = require("../../../models/StockLog");
const Seller = require("../../../models/Seller");
const { generateOrderId } = require("../../../utils/generateId");
const { success, error } = require("../../../utils/apiResponse");
const razorpay = require("../../../config/razorpay");
const Notification = require("../../../models/Notification");
const { notifySellerLowStock, DEFAULT_LOW_STOCK_THRESHOLD } = require("../../../services/sellerNotificationService");
const {
  isSerializedVariant,
  consumeSerializedStock,
  restockSerializedUnits
} = require("../../../utils/inventorySync");

const toIdSet = (values = []) =>
  new Set((Array.isArray(values) ? values : []).map((value) => String(value)));

const ensureProductOrderable = async (product) => {
  if (!product || product.status !== "Active" || product.active === false) {
    throw new Error(`Product ${product?._id || ""} is currently unavailable`);
  }

  if (product.sellerId) {
    const seller = await Seller.findById(product.sellerId).select("status").lean();
    if (!seller || seller.status !== "APPROVED") {
      throw new Error(`${product.name} is currently unavailable`);
    }
  }
};

/**
 * Shared helper: validate + compute coupon discount.
 * Returns { discount, coupon } or throws an error string.
 * BUG-12 FIX: centralised coupon validation re-used at order time.
 */
const applyCoupon = async (couponCode, subtotal, userId, items = []) => {
  const normalizedCode = String(couponCode || "").trim().toUpperCase();
  if (!normalizedCode) return { discount: 0, coupon: null };

  const coupon = await Coupon.findOne({ code: normalizedCode, active: true });
  if (!coupon) return { discount: 0, coupon: null };

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) return { discount: 0, coupon: null };
  if (coupon.validUntil && now > coupon.validUntil) return { discount: 0, coupon: null };
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { discount: 0, coupon: null };

  const userUsage = coupon.usedBy.filter(u => u.userId.toString() === userId.toString()).length;
  if (coupon.perUserLimit && userUsage >= coupon.perUserLimit) return { discount: 0, coupon: null };

  // New User Eligibility
  if (coupon.userEligibility === "new") {
    const priorOrders = await Order.countDocuments({ userId, paymentStatus: "paid" });
    if (priorOrders > 0) return { discount: 0, coupon: null };
  }

  // Applicability Checks
  let applicableTotal = subtotal;
  if (coupon.applicabilityType !== "all") {
    const categoryIdSet = toIdSet(coupon.applicableCategories);
    const productIdSet = toIdSet(coupon.applicableProducts);

    const applicableItems = items.filter(item => {
      const itemCategoryId = String(item?.categoryId || "");
      const itemProductId = String(item?.productId || item?.id || "");
      if (coupon.applicabilityType === "category") return categoryIdSet.has(itemCategoryId);
      if (coupon.applicabilityType === "product") return productIdSet.has(itemProductId);
      return false;
    });

    if (applicableItems.length === 0) return { discount: 0, coupon: null };
    applicableTotal = applicableItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  if (applicableTotal < coupon.minOrderValue) return { discount: 0, coupon: null };

  let discount = 0;
  if (coupon.type === "flat") {
    discount = coupon.value;
  } else if (coupon.type === "percentage") {
    discount = Math.round((applicableTotal * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
  } else if (coupon.type === "free_shipping") {
    discount = 0; // Handled by setting shipping to 0 in placeOrder
  }

  discount = Math.min(discount, applicableTotal);

  return { 
    discount, 
    coupon, 
    isFreeShipping: coupon.type === "free_shipping" 
  };
};

/**
 * Shared helper: deduct stock and create stock logs for an order.
 * BUG-02 FIX: extracted so it can be called AFTER payment verification.
 */
const deductStockForOrder = async (orderItems, orderId, userId) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    const variant = product?.variants.id(item.variantId);
    if (!product || !variant) continue;

    const quantity = Number(item.quantity) || 0;
    if (quantity <= 0) continue;

    const previousStock = Number(variant.stock) || 0;
    const variantIndex = product.variants.findIndex(v => String(v._id) === String(item.variantId));

    if (isSerializedVariant(product, variant)) {
      consumeSerializedStock({
        product,
        variant,
        quantity,
        variantIndex,
        saleStatus: "SOLD_ONLINE"
      });
    } else {
      if (previousStock < quantity) {
        throw new Error(`Insufficient stock for ${product.name} (${variant.name})`);
      }
      variant.stock = previousStock - quantity;
    }

    variant.sold = (Number(variant.sold) || 0) + quantity;
    await product.save();

    // Low stock notification (best-effort, de-duped).
    if (item?.sellerId) {
      await notifySellerLowStock({
        sellerId: item.sellerId,
        productId: product._id,
        variantId: variant._id,
        productName: product.name,
        variantName: variant.name,
        currentStock: Number(variant.stock) || 0,
        threshold: DEFAULT_LOW_STOCK_THRESHOLD
      });
    }

    await StockLog.create({
      productId: item.productId,
      variantId: item.variantId,
      changeType: "sale",
      previousStock,
      newStock: variant.stock,
      change: -quantity,
      reason: `Order ${orderId}`,
      userId,
    });
  }
};


/**
 * Internal helper to calculate order data without saving to DB.
 * Used by both placeOrder (for COD) and initiatePayment (for Razorpay).
 */
const _calculateOrderData = async (userId, userEmail, items, shippingAddress, paymentMethod, couponCode) => {
  if (!items || !items.length) throw new Error("Order must contain at least one item.");
  if (!shippingAddress) throw new Error("Shipping address is required.");

  let subtotal = 0;
  const orderItems = [];

  // 1. Validate Items & Stock & Price
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    await ensureProductOrderable(product);

    const variant = product.variants.id(item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} not found`);

    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name} (${variant.name})`);
    }

    const itemTotal = variant.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId:  product._id,
      variantId:  variant._id,
      name:       product.name,
      sku:        variant.sku || `${product.slug}-${variant.name}`,
      image:      product.images[0] || "",
      price:      variant.price,
      mrp:        variant.mrp,
      quantity:   item.quantity,
      sellerId:   product.sellerId,
      categoryId: product.categories?.[0] || undefined
    });
  }

  // 2. Handle Coupon
  let discount = 0;
  let appliedCoupon = null;
  let isFreeShipping = false;

  if (couponCode) {
    const result = await applyCoupon(couponCode, subtotal, userId, orderItems);
    discount = result.discount;
    appliedCoupon = result.coupon;
    isFreeShipping = result.isFreeShipping;
  }

  // Default shipping logic (₹49 if < ₹999, else 0)
  let shipping = subtotal - discount > 999 ? 0 : 49;
  if (isFreeShipping) shipping = 0;

  const total = subtotal - discount + shipping;

  return {
    orderId:       generateOrderId(),
    userId,
    customerName:  `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    customerEmail: shippingAddress.email || userEmail,
    customerPhone: shippingAddress.phone,
    items:         orderItems,
    shippingAddress,
    paymentMethod,
    couponCode:    appliedCoupon ? couponCode.toUpperCase() : undefined,
    subtotal,
    discount,
    shipping,
    total,
    status:           paymentMethod === "cod" ? "Processing" : "Pending",
    paymentStatus:    paymentMethod === "cod" ? "cod" : "pending",
    timeline:      [{ status: "Ordered", note: "Order placed successfully" }],
  };
};

// ─────────────────────────────────────────────────────────────────
// POST /api/user/orders  — Place an Order
// ─────────────────────────────────────────────────────────────────
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    // Use shared helper to prepare order data
    const orderData = await _calculateOrderData(userId, userEmail, items, shippingAddress, paymentMethod, couponCode);

    // 4. Create Razorpay order (no stock deduction yet for online payments)
    if (paymentMethod === "razorpay") {
      try {
        const rpOrder = await razorpay.orders.create({
          amount:   Math.round(orderData.total * 100),
          currency: "INR",
          receipt:  orderData.orderId,
        });
        orderData.razorpayOrderId = rpOrder.id;
      } catch (err) {
        orderData.razorpayOrderId = "rzp_stub_" + Date.now();
        console.error("Razorpay Order Creation Failed:", err.message);
      }
    }

    const order = await Order.create(orderData);

    // Notify sellers
    const sellerCounts = new Map();
    for (const item of orderData.items) {
      const sid = item?.sellerId ? String(item.sellerId) : "";
      if (!sid) continue;
      sellerCounts.set(sid, (sellerCounts.get(sid) || 0) + (Number(item.quantity) || 0));
    }
    if (sellerCounts.size > 0) {
      const sellerOrderLink = `/seller/order-details/${order._id}`;
      const docs = Array.from(sellerCounts.entries()).map(([sid, qty]) => ({
        sellerId: sid,
        title: "New order received",
        message: `Order ${order.orderId} placed (${qty} item${qty === 1 ? "" : "s"}).`,
        type: "ORDER",
        priority: "Medium",
        link: sellerOrderLink,
        isBroadcast: false,
        isRead: false
      }));
      try { await Notification.insertMany(docs); } catch (e) { /* ignore */ }
    }

    // 5. Deduct Stock immediately ONLY for COD
    if (paymentMethod === "cod") {
      await deductStockForOrder(orderData.items, order.orderId, userId);

      if (order.couponCode) {
        await Coupon.updateOne(
          { code: order.couponCode, active: true },
          {
            $inc:  { usageCount: 1 },
            $push: { usedBy: { userId, usedAt: new Date() } },
          }
        );
      }
    }

    return success(res, { order }, "Order placed successfully", 201);

  } catch (err) { return error(res, err.message); }
};

// Export the helpers so payment controller can use them
exports._deductStockForOrder = deductStockForOrder;
exports._applyCoupon = applyCoupon;
exports._calculateOrderData = _calculateOrderData;


// ─────────────────────────────────────────────────────────────────
// GET /api/user/orders
// ─────────────────────────────────────────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    return success(res, { orders }, "Order history retrieved");
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// GET /api/user/orders/:id
// ─────────────────────────────────────────────────────────────────
exports.getOrderDetail = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return error(res, "Invalid order id", 400);
    }
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!order) return error(res, "Order not found", 404);
    return success(res, { order }, "Order details retrieved");
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// POST /api/user/orders/:id/cancel
// ─────────────────────────────────────────────────────────────────
exports.cancelOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return error(res, "Invalid order id", 400);
    }
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!order) return error(res, "Order not found", 404);

    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return error(res, `Cannot cancel order in ${order.status} status`, 400);
    }

    order.status = "Cancelled";
    order.timeline.push({ status: "Cancelled", note: "Cancelled by user" });
    await order.save();

    // Restock only if stock was already deducted (COD or paid Razorpay orders)
    if (order.paymentStatus === "cod" || order.paymentStatus === "paid") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        const variant = product?.variants.id(item.variantId);
        if (!product || !variant) continue;

        const quantity = Number(item.quantity) || 0;
        if (quantity <= 0) continue;

        const previousStock = Number(variant.stock) || 0;
        const variantIndex = product.variants.findIndex(v => String(v._id) === String(item.variantId));

        if (isSerializedVariant(product, variant)) {
          restockSerializedUnits({
            product,
            variant,
            quantity,
            variantIndex
          });
        } else {
          variant.stock = previousStock + quantity;
        }

        variant.sold = Math.max(0, (Number(variant.sold) || 0) - quantity);
        await product.save();

        await StockLog.create({
          productId: item.productId,
          variantId: item.variantId,
          changeType: "return",
          previousStock,
          newStock: variant.stock,
          change: variant.stock - previousStock,
          reason: `Order ${order.orderId} cancelled by user`,
          userId: req.user.userId
        });
      }
    }

    return success(res, { order }, "Order cancelled successfully");
  } catch (err) { return error(res, err.message); }
};
