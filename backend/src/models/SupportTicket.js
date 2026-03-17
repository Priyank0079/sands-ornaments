const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  userName: String,
  userEmail: String,
  subject: { type: String, required: true },
  category: { type: String, enum: ["Product Feedback", "Order Tracking", "Payment Issue", "Return/Refund", "General Inquiry", "Other"] },
  orderId: String,
  message: { type: String, required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open", index: true },
  replies: [{
    from: { type: String, enum: ["user", "admin"] },
    text: String,
    date: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
