const Setting = require("../../../models/Setting");
const { success, error } = require("../../../utils/apiResponse");
const Product = require("../../../models/Product");
const { applyMetalPricingToProduct } = require("../../../utils/metalPricing");

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
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});
    return success(res, {
      metalRates: settings.metalRates || {},
      gstRate: settings.gstRate || 0
    }, "Metal pricing retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateMetalPricing = async (req, res) => {
  try {
    const { metalRates, gstRate } = req.body || {};
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});

    if (metalRates && typeof metalRates === "object") {
      settings.metalRates = {
        ...settings.metalRates,
        ...metalRates
      };
    }
    if (gstRate !== undefined && gstRate !== null) {
      settings.gstRate = Number(gstRate) || 0;
    }
    await settings.save();

    const adminProducts = await Product.find({
      $or: [{ sellerId: null }, { sellerId: { $exists: false } }]
    });

    for (const product of adminProducts) {
      applyMetalPricingToProduct(product, settings.metalRates || {}, settings.gstRate || 0);
      await product.save();
    }

    return success(res, { settings }, "Metal pricing updated successfully");
  } catch (err) { return error(res, err.message); }
};
