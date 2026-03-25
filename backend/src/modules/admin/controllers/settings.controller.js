const Setting = require("../../../models/Setting");
const { success, error } = require("../../../utils/apiResponse");
const Product = require("../../../models/Product");
const Seller = require("../../../models/Seller");
const { applyMetalPricingToProduct } = require("../../../utils/metalPricing");

const normalizeRateValue = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeMetalRates = (incoming = {}, existing = {}) => {
  const normalized = {
    goldPerGram: normalizeRateValue(incoming.goldPerGram, normalizeRateValue(existing.goldPerGram, 0)),
    goldPerMilligram: normalizeRateValue(incoming.goldPerMilligram, normalizeRateValue(existing.goldPerMilligram, 0)),
    silverPerGram: normalizeRateValue(incoming.silverPerGram, normalizeRateValue(existing.silverPerGram, 0)),
    silverPerMilligram: normalizeRateValue(incoming.silverPerMilligram, normalizeRateValue(existing.silverPerMilligram, 0))
  };

  if (incoming.goldPerGram !== undefined && incoming.goldPerMilligram === undefined) {
    normalized.goldPerMilligram = normalized.goldPerGram / 1000;
  }
  if (incoming.goldPerMilligram !== undefined && incoming.goldPerGram === undefined) {
    normalized.goldPerGram = normalized.goldPerMilligram * 1000;
  }
  if (incoming.silverPerGram !== undefined && incoming.silverPerMilligram === undefined) {
    normalized.silverPerMilligram = normalized.silverPerGram / 1000;
  }
  if (incoming.silverPerMilligram !== undefined && incoming.silverPerGram === undefined) {
    normalized.silverPerGram = normalized.silverPerMilligram * 1000;
  }

  return normalized;
};

const hasNegativeRate = (rates = {}) =>
  Object.values(rates).some((value) => Number(value) < 0);

const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
};

const buildSellerRateMap = async (products = []) => {
  const sellerIds = [...new Set(
    products
      .map((product) => product.sellerId ? String(product.sellerId) : null)
      .filter(Boolean)
  )];
  const sellers = await Seller.find({ _id: { $in: sellerIds } }).select("_id metalRates");
  return new Map(sellers.map((seller) => [String(seller._id), seller.metalRates || {}]));
};

const countAdminOwnedProducts = async () => Product.countDocuments({
  $or: [{ sellerId: null }, { sellerId: { $exists: false } }]
});

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({}); // Initialize with defaults
    }
    return success(res, { settings });
  } catch (err) { return error(res, err.message); }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    return success(res, { settings }, "Settings updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getMetalPricing = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const adminProductCount = await countAdminOwnedProducts();
    return success(res, {
      metalRates: settings.metalRates || {},
      adminProductCount,
      updatedAt: settings.metalPricingUpdatedAt || settings.updatedAt || settings.createdAt || null
    }, "Metal pricing retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateMetalPricing = async (req, res) => {
  try {
    const { metalRates, gstRate } = req.body || {};
    const settings = await getOrCreateSettings();

    if (gstRate !== undefined && gstRate !== null) {
      return error(res, "GST is managed through Tax Settings, not Metal Pricing", 400);
    }

    if (metalRates && typeof metalRates === "object") {
      const normalizedRates = normalizeMetalRates(metalRates, settings.metalRates || {});
      if (hasNegativeRate(normalizedRates)) {
        return error(res, "Metal rates cannot be negative", 400);
      }
      settings.metalRates = normalizedRates;
    }
    settings.metalPricingUpdatedAt = new Date();
    await settings.save();

    const adminProducts = await Product.find({
      $or: [{ sellerId: null }, { sellerId: { $exists: false } }]
    });

    for (const product of adminProducts) {
      applyMetalPricingToProduct(product, settings.metalRates || {}, settings.gstRate || 0);
      await product.save();
    }

    const adminProductCount = await countAdminOwnedProducts();
    return success(res, {
      metalRates: settings.metalRates || {},
      adminProductCount,
      updatedAt: settings.metalPricingUpdatedAt || settings.updatedAt || settings.createdAt || null
    }, "Metal pricing updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getTaxSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const totalProductCount = await Product.countDocuments();
    return success(res, {
      gstRate: settings.gstRate || 0,
      totalProductCount,
      updatedAt: settings.taxSettingsUpdatedAt || settings.updatedAt || settings.createdAt || null
    }, "Tax settings retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateTaxSettings = async (req, res) => {
  try {
    const { gstRate } = req.body || {};
    const normalizedGst = Number(gstRate);
    if (!Number.isFinite(normalizedGst) || normalizedGst < 0) {
      return error(res, "GST cannot be negative", 400);
    }

    const settings = await getOrCreateSettings();
    settings.gstRate = normalizedGst;
    settings.taxSettingsUpdatedAt = new Date();
    await settings.save();

    const allProducts = await Product.find({});
    const sellerRateMap = await buildSellerRateMap(allProducts);

    for (const product of allProducts) {
      const ownerRates = product.sellerId
        ? (sellerRateMap.get(String(product.sellerId)) || {})
        : (settings.metalRates || {});
      applyMetalPricingToProduct(product, ownerRates, settings.gstRate || 0);
      await product.save();
    }

    return success(res, {
      gstRate: settings.gstRate || 0,
      totalProductCount: allProducts.length,
      updatedAt: settings.taxSettingsUpdatedAt || settings.updatedAt || settings.createdAt || null
    }, "Tax settings updated successfully");
  } catch (err) { return error(res, err.message); }
};
