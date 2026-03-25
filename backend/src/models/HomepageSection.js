const mongoose = require("mongoose");

const homepageItemSchema = new mongoose.Schema({
  itemId: { type: String },
  type: { type: String, default: "manual" }, // manual | product
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  limit: { type: Number },
  name: String,
  label: String,
  image: String,
  path: String,
  tag: String,
  price: String,
  priceMax: { type: Number },
  extraImages: [String],
  sortOrder: { type: Number, default: 0 }
}, { _id: false });

const homepageSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true, index: true },
  label: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  items: [homepageItemSchema]
}, { timestamps: true });

module.exports = mongoose.model("HomepageSection", homepageSectionSchema);
