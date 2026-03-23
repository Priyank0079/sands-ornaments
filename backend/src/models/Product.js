const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: "text" },
  slug: { type: String, unique: true, index: true },
  productCode: { type: String, unique: true, sparse: true },
  sku: { type: String, unique: true, sparse: true },
  huid: { type: String, trim: true, sparse: true },
  brand: { type: String, default: "SANDS" },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  description: { type: String },
  stylingTips: { type: String },
  material: { type: String, default: 'Silver' },
  silverCategory: {
      type: String,
      enum: ['800', '835', '925', '925 sterling silver', '958', '970', '990', '999', '']
  },
  goldCategory: {
      type: String,
      enum: ['14', '18', '22', '24', '']
  },
  careTips: { type: String, default: '' },
  weight: { type: Number },
  weightUnit: { type: String, enum: ["Grams", "Carats", "Milligrams"], default: "Grams" },
  specifications: { type: String },
  supplierInfo: { type: String },
  cardLabel: { type: String },
  cardBadge: { type: String },
  images: [{ type: String }],
  variants: [{
    name: { type: String, required: true },
    makingCharge: { type: Number, default: 0 },
    diamondPrice: { type: Number, default: 0 },
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
  active: { type: Boolean, default: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", default: null },
  navShopByCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  navGiftsFor: [{ type: String }],
  navOccasions: [{ type: String }],
  faqs: [{
    question: { type: String, trim: true },
    answer: { type: String, trim: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
