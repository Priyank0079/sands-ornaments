const Seller = require("../../../models/Seller");
const bcrypt = require("bcryptjs");
const { success, error } = require("../../../utils/apiResponse");
const Setting = require("../../../models/Setting");
const Product = require("../../../models/Product");
const { applyMetalPricingToProduct } = require("../../../utils/metalPricing");

exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.userId).select("-password");
    if (!seller) return error(res, "Seller not found", 404);
    return success(res, { seller });
  } catch (err) { return error(res, err.message); }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "shopName",
      "email",
      "mobileNumber",
      "gstNumber",
      "panNumber",
      "bisNumber",
      "shopAddress",
      "city",
      "state",
      "pincode",
      "bankAccount"
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (typeof updates.bankAccount === "string") {
      try {
        updates.bankAccount = JSON.parse(updates.bankAccount);
      } catch (err) {
        delete updates.bankAccount;
      }
    }

    if (updates.email) {
      const existingEmail = await Seller.findOne({
        email: updates.email,
        _id: { $ne: req.user.userId }
      });
      if (existingEmail) return error(res, "Email already in use", 400);
    }

    if (updates.mobileNumber) {
      const existingMobile = await Seller.findOne({
        mobileNumber: updates.mobileNumber,
        _id: { $ne: req.user.userId }
      });
      if (existingMobile) return error(res, "Mobile number already in use", 400);
    }

    const seller = await Seller.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    return success(res, { seller }, "Profile updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return error(res, "Current and new password are required", 400);
    }
    if (newPassword.length < 8) {
      return error(res, "Password must be at least 8 characters long", 400);
    }

    const seller = await Seller.findById(req.user.userId);
    if (!seller) return error(res, "Seller not found", 404);

    const isMatch = await bcrypt.compare(currentPassword, seller.password);
    if (!isMatch) return error(res, "Current password is incorrect", 400);

    const salt = await bcrypt.genSalt(10);
    seller.password = await bcrypt.hash(newPassword, salt);
    await seller.save();

    return success(res, {}, "Password updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getMetalPricing = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.userId).select("metalRates");
    if (!seller) return error(res, "Seller not found", 404);
    const settings = await Setting.findOne();
    return success(res, {
      metalRates: seller.metalRates || {},
      gstRate: settings?.gstRate || 0
    }, "Metal pricing retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateMetalPricing = async (req, res) => {
  try {
    const { metalRates } = req.body || {};
    const seller = await Seller.findById(req.user.userId);
    if (!seller) return error(res, "Seller not found", 404);

    if (metalRates && typeof metalRates === "object") {
      seller.metalRates = {
        ...seller.metalRates,
        ...metalRates
      };
    }
    await seller.save();

    const settings = await Setting.findOne();
    const gstRate = settings?.gstRate || 0;

    const products = await Product.find({ sellerId: req.user.userId });
    for (const product of products) {
      applyMetalPricingToProduct(product, seller.metalRates || {}, gstRate);
      await product.save();
    }

    return success(res, { metalRates: seller.metalRates, gstRate }, "Metal pricing updated successfully");
  } catch (err) { return error(res, err.message); }
};
