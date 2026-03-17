const mongoose = require("mongoose");

const homepageSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true, index: true },
  label: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    sortOrder: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model("HomepageSection", homepageSectionSchema);
