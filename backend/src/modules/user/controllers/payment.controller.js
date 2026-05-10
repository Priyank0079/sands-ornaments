const crypto = require("crypto");
const razorpay = require("../../../config/razorpay");
const Order = require("../../../models/Order");
const Coupon = require("../../../models/Coupon");
const Notification = require("../../../models/Notification");
const { _deductStockForOrder, _calculateOrderData } = require("./order.controller");
const { success, error } = require("../../../utils/apiResponse");
const mongoose = require("mongoose");

// POST /api/user/payment/razorpay-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return error(res, "Payment service is not configured on the server.", 503);
    }

    const { orderId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return error(res, "Invalid order id", 400);
    }

    // BUG-03 FIX: Ensure the order belongs to the requesting user
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    if (!order) return error(res, "Order not found", 404);

    if (order.paymentStatus === "paid") {
      return error(res, "This order is already paid", 400);
    }

    const options = {
      amount:   Math.round(order.total * 100),
      currency: "INR",
      receipt:  order.orderId,
    };

    const rpOrder = await razorpay.orders.create(options);
    return success(res, { rpOrder }, "Razorpay order created");
  } catch (err) { return error(res, err.message); }
};


// POST /api/user/payment/initiate
exports.initiatePayment = async (req, res) => {
  try {
    if (!razorpay) {
      return error(res, "Payment service is not configured on the server.", 503);
    }

    const { items, shippingAddress, couponCode } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    // Calculate order data (this also validates stock and items)
    const orderData = await _calculateOrderData(userId, userEmail, items, shippingAddress, "razorpay", couponCode);

    const options = {
      amount:   Math.round(orderData.total * 100),
      currency: "INR",
      receipt:  orderData.orderId,
    };

    const rpOrder = await razorpay.orders.create(options);
    
    // Return both the razorpay order and the calculated data so frontend can pass it back for verification
    return success(res, { rpOrder, orderData }, "Razorpay payment initiated");
  } catch (err) { return error(res, err.message); }
};


// POST /api/user/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return error(res, "Payment verification is not configured on the server.", 503);
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;

    if (!orderData || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return error(res, "Missing payment verification details", 400);
    }

    // 1. Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return error(res, "Invalid payment signature", 400, "PAYMENT_SIGNATURE_INVALID");
    }

    // 2. Signature is valid - Now create the order in DB
    // SECURITY FIX: Re-calculate order data on server to prevent frontend tampering
    const userId = req.user.userId;
    const userEmail = req.user.email;
    const items = orderData.items;
    const shippingAddress = orderData.shippingAddress;
    const couponCode = orderData.couponCode;

    const validatedOrderData = await _calculateOrderData(
      userId, 
      userEmail, 
      items, 
      shippingAddress, 
      "razorpay", 
      couponCode
    );
    
    const finalOrderData = {
      ...validatedOrderData,
      paymentStatus: "paid",
      paymentDetails: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "Processing",
      timeline: [{ status: "Processing", note: "Payment verified successfully" }]
    };

    const order = await Order.create(finalOrderData);

    // 3. Post-creation logic: stock deduction and coupon usage
    await _deductStockForOrder(order.items, order.orderId, order.userId);

    if (order.couponCode) {
      await Coupon.updateOne(
        { code: order.couponCode, active: true },
        {
          $inc:  { usageCount: 1 },
          $push: { usedBy: { userId: order.userId, usedAt: new Date() } },
        }
      );
    }

    // 4. Notify sellers
    const sellerCounts = new Map();
    for (const item of order.items || []) {
      const sid = item?.sellerId ? String(item.sellerId) : "";
      if (!sid) continue;
      sellerCounts.set(sid, (sellerCounts.get(sid) || 0) + (Number(item.quantity) || 0));
    }
    if (sellerCounts.size > 0) {
      const sellerOrderLink = `/seller/order-details/${order._id}`;
      const docs = Array.from(sellerCounts.entries()).map(([sid, qty]) => ({
        sellerId: sid,
        title: "Payment confirmed",
        message: `Payment received for order ${order.orderId} (${qty} item${qty === 1 ? "" : "s"}).`,
        type: "ORDER",
        priority: "High",
        link: sellerOrderLink,
        isBroadcast: false,
        isRead: false
      }));
      try { await Notification.insertMany(docs); } catch (e) { /* ignore */ }
    }

    return success(res, { order }, "Payment verified and order created successfully");

  } catch (err) { return error(res, err.message); }
};
