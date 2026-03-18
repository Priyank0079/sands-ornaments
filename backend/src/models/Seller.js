const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  shopName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gstNumber: { type: String },
  panNumber: { type: String },
  bisNumber: { type: String },
  shopAddress: String,
  city: String,
  state: String,
  pincode: String,
  bankAccount: {
    accountNumber: { type: String },
    ifscCode: { type: String }
  },
  documents: {
    aadharUrl: String,
    shopLicenseUrl: String,
    certificateUrl: String
  },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING", index: true },
  rejectionReason: String,
  registrationDate: { type: Date, default: Date.now },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Seller", sellerSchema);
