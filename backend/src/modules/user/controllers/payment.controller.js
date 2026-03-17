const crypto = require("crypto");
const razorpay = require("../../../config/razorpay");
const Order = require("../../../models/Order");
const Coupon = require("../../../models/Coupon");
const { _deductStockForOrder } = require("./order.controller");
const { success, error } = require("../../../utils/apiResponse");

// POST /api/user/payment/razorpay-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

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


// POST /api/user/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // BUG-03 FIX: Only the order owner can verify payment
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    if (!order) return error(res, "Order not found", 404);

    if (order.paymentStatus === "paid") {
      return error(res, "Payment already verified for this order", 400);
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return error(res, "Invalid payment signature", 400, "PAYMENT_SIGNATURE_INVALID");
    }

    // Payment is authentic — now commit stock deduction and coupon usage
    // BUG-02 FIX: stock deducted HERE (after payment proof), not at order creation
    await _deductStockForOrder(order.items, order.orderId, order.userId);

    // BUG-01 FIX: Update coupon usedBy if a coupon was applied on this order
    if (order.couponCode) {
      await Coupon.updateOne(
        { code: order.couponCode, active: true },
        {
          $inc:  { usageCount: 1 },
          $push: { usedBy: { userId: order.userId, usedAt: new Date() } },
        }
      );
    }

    order.paymentStatus = "paid";
    order.paymentDetails = { razorpay_payment_id, razorpay_order_id, razorpay_signature };
    order.status = "Processing";
    order.timeline.push({ status: "Processing", note: "Payment verified successfully" });

    await order.save();
    return success(res, { order }, "Payment verified successfully");

  } catch (err) { return error(res, err.message); }
};
