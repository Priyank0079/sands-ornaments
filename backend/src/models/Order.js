const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantId: mongoose.Schema.Types.ObjectId,
    name: String,
    sku: String,
    image: String,
    price: Number,
    mrp: Number,
    quantity: Number,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", default: null }
  }],
  shippingAddress: {
    firstName: String, lastName: String, email: String, phone: String,
    flatNo: String, area: String, city: String, district: String,
    state: String, pincode: String
  },
  paymentMethod: { type: String, enum: ["razorpay", "cod"] },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  couponCode: String,
  subtotal: Number,
  discount: Number,
  shipping: Number,
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Processing", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Return Requested", "Returned"],
    default: "Processing"
  },
  shippingInfo: { carrier: String, trackingId: String, trackingUrl: String, estimatedDelivery: Date },
  timeline: [{ status: String, date: { type: Date, default: Date.now }, note: String }],
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
