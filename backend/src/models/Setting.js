const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  storeName: { type: String, default: "Sands Ornaments" },
  contactEmail: String,
  contactPhone: String,
  address: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  logo: String,
  favicon: String,
  maintenanceMode: { type: Boolean, default: false },
  shippingCharges: { type: Number, default: 0 },
  freeShippingThreshold: { type: Number, default: 0 },
  gstRate: { type: Number, default: 0 },
  metalPricingUpdatedAt: { type: Date, default: null },
  taxSettingsUpdatedAt: { type: Date, default: null },
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
  }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);
