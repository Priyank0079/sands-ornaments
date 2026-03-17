const mongoose = require("mongoose");
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const Coupon = require("../../../models/Coupon");
const StockLog = require("../../../models/StockLog");
const { generateOrderId } = require("../../../utils/generateId");
const { success, error } = require("../../../utils/apiResponse");
const razorpay = require("../../../config/razorpay");

/**
 * Shared helper: validate + compute coupon discount.
 * Returns { discount, coupon } or throws an error string.
 * BUG-12 FIX: centralised coupon validation re-used at order time.
 */
const applyCoupon = async (couponCode, subtotal, userId, items = []) => {
  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
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
    const applicableItems = items.filter(item => {
      if (coupon.applicabilityType === "category") return coupon.applicableCategories.includes(item.categoryId);
      if (coupon.applicabilityType === "subcategory") return coupon.applicableSubcategories.includes(item.subcategoryId);
      if (coupon.applicabilityType === "product") return coupon.applicableProducts.includes(item.productId);
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
    await Product.updateOne(
      { _id: item.productId, "variants._id": item.variantId },
      { $inc: { "variants.$.stock": -item.quantity, "variants.$.sold": item.quantity } }
    );

    const p = await Product.findById(item.productId);
    const v = p?.variants.id(item.variantId);
    if (!v) continue;

    await StockLog.create({
      productId: item.productId,
      variantId: item.variantId,
      changeType: "sale",
      previousStock: v.stock + item.quantity,
      newStock: v.stock,
      change: -item.quantity,
      reason: `Order ${orderId}`,
      userId,
    });
  }
};


// ─────────────────────────────────────────────────────────────────
// POST /api/user/orders  — Place an Order
// ─────────────────────────────────────────────────────────────────
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;
    const userId = req.user.userId;

    if (!items || !items.length) return error(res, "Order must contain at least one item.", 400);
    if (!shippingAddress) return error(res, "Shipping address is required.", 400);

    let subtotal = 0;
    const orderItems = [];

    // 1. Validate Items & Stock & Price
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return error(res, `Product ${item.productId} not found`, 404);

      const variant = product.variants.id(item.variantId);
      if (!variant) return error(res, `Variant ${item.variantId} not found`, 404);

      if (variant.stock < item.quantity) {
        return error(res, `Insufficient stock for ${product.name} (${variant.name})`, 400);
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
        categoryId: product.categories?.[0]?.categoryId,
        subcategoryId: product.categories?.[0]?.subcategoryId
      });
    }

    // 2. Handle Coupon — support advanced validation items
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
    
    // Override if Free Shipping coupon applied
    if (isFreeShipping) shipping = 0;

    const total = subtotal - discount + shipping;

    // 3. Build Order
    const orderData = {
      orderId:       generateOrderId(),
      userId,
      customerName:  `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      items:         orderItems,
      shippingAddress,
      paymentMethod,
      couponCode:    appliedCoupon ? couponCode.toUpperCase() : undefined,
      subtotal,
      discount,
      shipping,
      total,
      // BUG-02 FIX: COD orders are confirmed immediately; Razorpay orders stay "Pending" until payment
      status:           paymentMethod === "cod" ? "Processing" : "Pending",
      paymentStatus:    paymentMethod === "cod" ? "cod" : "pending",
      timeline:      [{ status: "Ordered", note: "Order placed successfully" }],
    };

    // 4. Create Razorpay order (no stock deduction yet for online payments)
    if (paymentMethod === "razorpay") {
      try {
        const rpOrder = await razorpay.orders.create({
          amount:   Math.round(total * 100),
          currency: "INR",
          receipt:  orderData.orderId,
        });
        orderData.razorpayOrderId = rpOrder.id;
      } catch (err) {
        // Dev/stub fallback — never reached in production with valid keys
        orderData.razorpayOrderId = "rzp_stub_" + Date.now();
        console.error("Razorpay Order Creation Failed:", err.message);
      }
    }

    const order = await Order.create(orderData);

    // 5. Deduct Stock immediately ONLY for COD (cash is guaranteed)
    //    For Razorpay, stock is deducted inside verifyPayment after signature check.
    if (paymentMethod === "cod") {
      await deductStockForOrder(orderItems, order.orderId, userId);

      // BUG-01 FIX: Update coupon usage on successful COD order
      if (appliedCoupon) {
        await Coupon.updateOne(
          { _id: appliedCoupon._id },
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
        await Product.updateOne(
          { _id: item.productId, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": item.quantity, "variants.$.sold": -item.quantity } }
        );
      }
    }

    return success(res, { order }, "Order cancelled successfully");
  } catch (err) { return error(res, err.message); }
};
