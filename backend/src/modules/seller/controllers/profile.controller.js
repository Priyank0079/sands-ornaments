const Seller = require("../../../models/Seller");
const bcrypt = require("bcryptjs");
const { success, error } = require("../../../utils/apiResponse");
const Setting = require("../../../models/Setting");
const Product = require("../../../models/Product");
const { computeVariantPricing, normalizeChargeBearer } = require("../../../utils/metalPricing");
const { normalizeMetalRates, hasNegativeRate } = require("../../../utils/metalRateNormalization");
const SellerMetalRateLog = require("../../../models/SellerMetalRateLog");

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

    const trimString = (value) => (typeof value === "string" ? value.trim() : value);
    const upperString = (value) => (typeof value === "string" ? value.trim().toUpperCase() : value);
    const digitsOnly = (value) => (typeof value === "string" ? value.replace(/\D/g, "") : value);
    const isEmailLike = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
    const isValidIfsc = (value = "") => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(value || "").trim().toUpperCase());
    const isValidGst = (value = "") => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(String(value || "").trim().toUpperCase());
    const isValidPan = (value = "") => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(value || "").trim().toUpperCase());

    if (updates.fullName !== undefined) updates.fullName = trimString(updates.fullName);
    if (updates.shopName !== undefined) updates.shopName = trimString(updates.shopName);
    if (updates.email !== undefined) updates.email = String(updates.email || "").trim().toLowerCase();
    if (updates.mobileNumber !== undefined) updates.mobileNumber = digitsOnly(String(updates.mobileNumber || "").trim());
    if (updates.gstNumber !== undefined) updates.gstNumber = upperString(updates.gstNumber);
    if (updates.panNumber !== undefined) updates.panNumber = upperString(updates.panNumber);
    if (updates.bisNumber !== undefined) updates.bisNumber = upperString(updates.bisNumber);
    if (updates.shopAddress !== undefined) updates.shopAddress = trimString(updates.shopAddress);
    if (updates.city !== undefined) updates.city = trimString(updates.city);
    if (updates.state !== undefined) updates.state = trimString(updates.state);
    if (updates.pincode !== undefined) updates.pincode = digitsOnly(String(updates.pincode || "").trim());

    if (updates.bankAccount && typeof updates.bankAccount === "object") {
      updates.bankAccount = {
        accountNumber: digitsOnly(String(updates.bankAccount.accountNumber || "").trim()),
        ifscCode: upperString(updates.bankAccount.ifscCode)
      };
    }

    if (updates.fullName !== undefined && !updates.fullName) {
      return error(res, "Full name is required", 400);
    }

    if (updates.shopName !== undefined && !updates.shopName) {
      return error(res, "Shop name is required", 400);
    }

    if (updates.email !== undefined && !updates.email) {
      return error(res, "Email is required", 400);
    }

    if (updates.email && !isEmailLike(updates.email)) {
      return error(res, "Invalid email address", 400);
    }

    if (updates.mobileNumber !== undefined && !updates.mobileNumber) {
      return error(res, "Mobile number is required", 400);
    }

    if (updates.mobileNumber && String(updates.mobileNumber).length !== 10) {
      return error(res, "Mobile number must be 10 digits", 400);
    }

    if (updates.pincode && String(updates.pincode).length !== 6) {
      return error(res, "Pincode must be 6 digits", 400);
    }

    if (updates.gstNumber && !isValidGst(updates.gstNumber)) {
      return error(res, "Invalid GST number", 400);
    }

    if (updates.panNumber && !isValidPan(updates.panNumber)) {
      return error(res, "Invalid PAN number", 400);
    }

    if (updates.bankAccount && typeof updates.bankAccount === "object") {
      const acc = String(updates.bankAccount.accountNumber || "");
      const ifsc = String(updates.bankAccount.ifscCode || "");

      if ((acc && (acc.length < 9 || acc.length > 18)) || (ifsc && !isValidIfsc(ifsc))) {
        return error(res, "Invalid bank account details", 400);
      }

      if ((acc && !ifsc) || (!acc && ifsc)) {
        return error(res, "Both account number and IFSC code are required", 400);
      }

      if (!acc && !ifsc) {
        delete updates.bankAccount;
      }
    }

    // Prevent persisting empty optional identifiers.
    if (updates.gstNumber !== undefined && !updates.gstNumber) delete updates.gstNumber;
    if (updates.panNumber !== undefined && !updates.panNumber) delete updates.panNumber;
    if (updates.bisNumber !== undefined && !updates.bisNumber) delete updates.bisNumber;

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
    if (newPassword.length < 4) {
      return error(res, "Password must be at least 4 characters long", 400);
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
    const seller = await Seller.findById(req.user.userId).select("metalRates updatedAt");
    if (!seller) return error(res, "Seller not found", 404);
    const settings = await Setting.findOne();
    const sellerProductCount = await Product.countDocuments({ sellerId: req.user.userId });
    const normalizedRates = normalizeMetalRates({}, seller.metalRates || {});
    return success(res, {
      metalRates: normalizedRates,
      gstRate: settings?.gstRate || 0,
      sellerProductCount,
      updatedAt: seller.updatedAt || null
    }, "Metal pricing retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateMetalPricing = async (req, res) => {
  try {
    const { metalRates, gstRate: requestedGstRate } = req.body || {};
    const seller = await Seller.findById(req.user.userId);
    if (!seller) return error(res, "Seller not found", 404);

    const previousRates = seller.metalRates ? { ...seller.metalRates } : {};

    if (requestedGstRate !== undefined && requestedGstRate !== null) {
      return error(res, "GST is managed by admin and cannot be updated from seller metal pricing", 400);
    }

    if (metalRates && typeof metalRates === "object") {
      const normalized = normalizeMetalRates(metalRates, seller.metalRates || {});
      if (hasNegativeRate(normalized)) {
        return error(res, "Metal rates cannot be negative", 400);
      }
      seller.metalRates = normalized;
    }
    await seller.save();

    const settings = await Setting.findOne();
    const gstRate = settings?.gstRate || 0;

    // Production hardening: reprice in batches via bulkWrite to avoid timeouts and partial failures.
    const sellerId = req.user.userId;
    const cursor = Product.find({ sellerId })
      .select("paymentGatewayChargeBearer material goldCategory silverCategory weight weightUnit variants")
      .lean()
      .cursor();

    const batchSize = 200;
    let ops = [];
    let processedProducts = 0;
    let processedVariants = 0;
    let modifiedProducts = 0;
    const failedProductIds = [];

    const flush = async () => {
      if (ops.length === 0) return;
      try {
        const result = await Product.bulkWrite(ops, { ordered: false });
        modifiedProducts += Number(result?.modifiedCount || 0);
      } catch (err) {
        // bulkWrite can throw when some ops fail; we still want to continue.
        // We already track per-product compute failures; here we only log and continue.
        console.error("Seller metal repricing bulkWrite failed:", err?.message || err);
      } finally {
        ops = [];
      }
    };

    for await (const product of cursor) {
      try {
        const normalizedBearer = normalizeChargeBearer(product.paymentGatewayChargeBearer);
        const productPayload = {
          ...product,
          paymentGatewayChargeBearer: normalizedBearer
        };

        const variants = Array.isArray(productPayload.variants) ? productPayload.variants : [];
        const nextVariants = variants.map((variant) => {
          const pricing = computeVariantPricing({
            product: productPayload,
            variant,
            rates: seller.metalRates || {},
            gstRate
          });
          return { ...variant, ...pricing };
        });

        processedProducts += 1;
        processedVariants += nextVariants.length;

        ops.push({
          updateOne: {
            filter: { _id: productPayload._id, sellerId },
            update: {
              $set: {
                paymentGatewayChargeBearer: normalizedBearer,
                variants: nextVariants,
                updatedAt: new Date()
              }
            }
          }
        });

        if (ops.length >= batchSize) {
          await flush();
        }
      } catch (err) {
        failedProductIds.push(String(product?._id || ""));
      }
    }
    await flush();

    const sellerProductCount = processedProducts;

    // Audit trail (best effort).
    await SellerMetalRateLog.create({
      sellerId,
      previousRates,
      newRates: seller.metalRates || {},
      gstRate,
      summary: {
        updatedProducts: modifiedProducts || processedProducts,
        updatedVariants: processedVariants,
        failedProducts: failedProductIds.length
      }
    }).catch(() => {});

    return success(res, {
      metalRates: normalizeMetalRates({}, seller.metalRates || {}),
      gstRate,
      sellerProductCount,
      updatedAt: seller.updatedAt || null,
      updateSummary: {
        processedProducts,
        modifiedProducts,
        processedVariants,
        failedProductIds
      }
    }, "Metal pricing updated successfully");
  } catch (err) { return error(res, err.message); }
};
