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
  metalRates: {
    goldPerGram: { type: Number, default: 0 },
    goldPerMilligram: { type: Number, default: 0 },
    silverPerGram: { type: Number, default: 0 },
    silverPerMilligram: { type: Number, default: 0 },
    gold10g: {
      k14: { type: Number, default: 0 },
      k18: { type: Number, default: 0 },
      k22: { type: Number, default: 0 },
      k24: { type: Number, default: 0 }
    },
    silver10g: {
      sterling925: { type: Number, default: 0 },
      silverOther: { type: Number, default: 0 }
    }
  },
  termsAcceptedAt: { type: Date },
  termsVersion: { type: Date },

  // Auth hardening: DB-backed login lockout to mitigate brute force.
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Seller", sellerSchema);
