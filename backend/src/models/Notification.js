const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["ORDER", "RETURN", "REPLACEMENT", "COUPON", "GENERAL", "SELLER_REQUEST"], default: "GENERAL" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  link: String,
  isBroadcast: { type: Boolean, default: false, index: true },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
