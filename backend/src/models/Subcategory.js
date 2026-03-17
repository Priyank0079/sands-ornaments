const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);
