const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: "text" },
  slug: { type: String, unique: true, index: true },
  brand: { type: String, default: "SANDS" },
  categories: [{
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" }
  }],
  description: { type: String },
  stylingTips: { type: String },
  material: { type: String, default: "925 Silver" },
  weight: { type: Number },
  weightUnit: { type: String, enum: ["Grams", "Carats", "Milligrams"], default: "Grams" },
  specifications: { type: String },
  supplierInfo: { type: String },
  cardLabel: { type: String },
  cardBadge: { type: String },
  images: [{ type: String }],
  variants: [{
    name: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    stock: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0 }
  }],
  tags: {
    isNewArrival: { type: Boolean, default: false },
    isMostGifted: { type: Boolean, default: false },
    isNewLaunch: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false }
  },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Draft", "Archived"], default: "Active" },
  showInNavbar: { type: Boolean, default: true },
  showInCollection: { type: Boolean, default: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
