const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    phone:   { type: String, required: true, unique: true, index: true, trim: true },
    email:   { type: String, default: "", trim: true, lowercase: true },
    role:    { type: String, enum: ["user", "admin"], default: "user" },
    password:{ type: String, default: null },   // admin only — bcrypt hashed

    points:              { type: Number, default: 0 },
    usedCoupons:         [{ type: String }],
    isBlocked:           { type: Boolean, default: false },
    notificationsEnabled:{ type: Boolean, default: true },
    wishlist:            [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
