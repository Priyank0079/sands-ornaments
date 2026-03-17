const crypto = require("crypto");
const razorpay = require("../config/razorpay");

/**
 * Create a new Razorpay order
 * @param {Number} amount - Amount in basic unit (e.g. INR)
 * @param {String} currency - Currency code (default INR)
 * @param {String} receipt - Unique identifier for the transaction
 */
const createOrder = async (amount, currency = "INR", receipt) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paisa
      currency,
      receipt,
      payment_capture: 1 // auto-capture
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (err) {
    console.error("[Razorpay] Order creation failed:", err.message);
    throw new Error("Failed to create payment order. " + err.message);
  }
};

/**
 * Verify Razorpay signature
 */
const verifySignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  try {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    return expected === signature;
  } catch (err) {
    return false;
  }
};

module.exports = { createOrder, verifySignature };
