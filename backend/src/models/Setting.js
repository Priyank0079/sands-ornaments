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
  },

  // ── Platform commission configuration ────────────────────────────────
  // Tiers are evaluated upper-inclusive: an amount A matches a tier when
  // (A >= minAmount && (maxAmount === null || A <= maxAmount)).
  //
  // commissionEnabled is a PERMANENT operational kill-switch — not a rollout
  // flag. It exists so Ops can suspend new accruals during an emergency
  // (e.g. tier misconfiguration, billing freeze). When false:
  //   • New accruals are skipped silently (placeOrder / verifyPayment).
  //   • In-flight confirmations and reversals still run, so historical
  //     ledger entries continue to settle correctly.
  //   • The Admin UI shows the disabled state and blocks tier saves.
  // Do NOT remove this field — see docs/COMMISSION.md ("Kill-switch policy").
  commissionEnabled: { type: Boolean, default: true },
  commissionTiers: {
    type: [
      {
        _id: false,
        minAmount:  { type: Number, required: true, min: 0 },
        maxAmount:  { type: Number, default: null },
        commission: { type: Number, required: true, min: 0 }
      }
    ],
    default: []
  },
  commissionUpdatedAt:    { type: Date, default: null },
  commissionBackfilledAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);
