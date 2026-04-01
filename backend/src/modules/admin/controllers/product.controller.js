const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const Review = require("../../../models/Review");
const HomepageSection = require("../../../models/HomepageSection");
const slugify = require("../../../utils/slugify");
const { deleteFromCloudinary } = require("../../../utils/cloudinaryUtils");
const { success, error } = require("../../../utils/apiResponse");
const Setting = require("../../../models/Setting");
const { applyMetalPricingToProduct } = require("../../../utils/metalPricing");
const { generateUniqueProductCode, generateVariantCode } = require("../../../utils/productIdentity");
const { normalizeProductForResponse } = require("../../../utils/productCompatibility");

// BUG-10 FIX: explicit whitelist of fields that can be updated via API
const PRODUCT_UPDATE_WHITELIST = [
  "name", "description", "slug", "productCode", "tags", "stylingTips",
  "variants", "status", "categories", "sellerId",
  "isFeatured", "isTrending", "isNewArrival",
  "returnEligibilities", "weight", "material", "faqs",
  "showInNavbar", "showInCollection", "active",
  "navShopByCategory", "navGiftsFor", "navOccasions",
  "cardLabel", "cardBadge", "careTips", "silverCategory",
  "goldCategory", "weightUnit", "specifications", "supplierInfo",
  "huid", "sizes", "isSerialized"
];

const normalizeSerialCodes = (codes = []) => {
  if (!Array.isArray(codes)) return [];
  return codes
    .map(code => {
      if (typeof code === "string") return { code, status: "AVAILABLE" };
      if (code && typeof code === "object" && code.code) {
        return { code: String(code.code), status: code.status || "AVAILABLE" };
      }
      return null;
    })
    .filter(Boolean);
};

const countAvailableCodes = (codes = []) =>
  codes.filter(c => (c.status || "AVAILABLE") === "AVAILABLE").length;

const normalizeVariantFields = (variants = [], fallback = {}) => {
  const fallbackWeight = fallback.weight !== undefined && fallback.weight !== null
    ? Number(fallback.weight) || 0
    : undefined;
  const fallbackWeightUnit = fallback.weightUnit || "Grams";
  return variants.map((variant) => ({
    ...variant,
    variantCode: variant.variantCode || "",
    variantImages: Array.isArray(variant.variantImages)
      ? variant.variantImages.filter(Boolean)
      : [],
    variantFaqs: Array.isArray(variant.variantFaqs)
      ? variant.variantFaqs.map((faq) => ({
        question: String(faq?.question || "").trim(),
        answer: String(faq?.answer || "").trim()
      })).filter((faq) => faq.question || faq.answer)
      : [],
    weight: variant.weight !== undefined && variant.weight !== null && variant.weight !== ""
      ? Number(variant.weight) || 0
      : fallbackWeight,
    weightUnit: variant.weightUnit || fallbackWeightUnit,
    makingCharge: Number(variant.makingCharge) || 0,
    diamondPrice: Number(variant.diamondPrice) || 0,
    metalPrice: Number(variant.metalPrice) || 0,
    gst: Number(variant.gst) || 0,
    finalPrice: Number(variant.finalPrice) || 0,
    mrp: Number(variant.mrp) || 0,
    price: Number(variant.price) || 0,
    stock: Number(variant.stock) || 0,
    discount: Number(variant.discount) || 0,
    serialCodes: normalizeSerialCodes(variant.serialCodes || [])
  }));
};

const ensureVariantCodes = (variants = [], productCode = "") => {
  const existingCodes = new Set(
    variants
      .map((variant) => variant.variantCode)
      .filter(Boolean)
  );

  return variants.map((variant, index) => ({
    ...variant,
    variantCode: variant.variantCode || generateVariantCode(productCode, index, existingCodes)
  }));
};

const splitUploadedProductImages = (files = [], variantCount = 0) => {
  const normalizedFiles = Array.isArray(files) ? files : [];
  const productImages = normalizedFiles
    .filter((file) => file?.fieldname === "images")
    .map((file) => file.path)
    .filter(Boolean);

  const variantImageMap = {};
  for (let index = 0; index < variantCount; index += 1) {
    const fieldname = `variantImages_${index}`;
    const uploaded = normalizedFiles
      .filter((file) => file?.fieldname === fieldname)
      .map((file) => file.path)
      .filter(Boolean);
    if (uploaded.length > 0) {
      variantImageMap[index] = uploaded;
    }
  }

  return { productImages, variantImageMap };
};

const collectReferencedImageUrls = (productLike = {}) => {
  const productImages = Array.isArray(productLike.images) ? productLike.images.filter(Boolean) : [];
  const variantImages = Array.isArray(productLike.variants)
    ? productLike.variants.flatMap((variant) => (
      Array.isArray(variant?.variantImages) ? variant.variantImages.filter(Boolean) : []
    ))
    : [];

  return new Set([...productImages, ...variantImages]);
};


// ─────────────────────────────────────────────────────────────────
// POST /api/admin/products
// ─────────────────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.categories) {
      if (Array.isArray(data.categories)) {
        data.categories = data.categories.length > 0 ? [data.categories[0]] : [];
      } else if (typeof data.categories === "string") {
        data.categories = [data.categories];
      }
    }
    const productSlug = data.slug ? slugify(data.slug) : slugify(data.name);
    const existing = await Product.findOne({ slug: productSlug });
    if (existing) return error(res, "Product with this slug already exists.", 409);
    if (!data.productCode) {
      data.productCode = await generateUniqueProductCode(Product);
    }
    const existingProductCode = await Product.findOne({ productCode: data.productCode }).select("_id");
    if (existingProductCode) return error(res, "Product code already exists.", 409);

    if (data.variants && data.variants.length > 0) {
      data.variants = normalizeVariantFields(data.variants, {
        weight: data.weight,
        weightUnit: data.weightUnit
      }).map(v => {
        if (v.mrp && v.price && !v.discount) {
          v.discount = Math.round(((v.mrp - v.price) / v.mrp) * 100);
        }
        const serialCodes = normalizeSerialCodes(v.serialCodes || []);
        if (serialCodes.length > 0) {
          v.serialCodes = serialCodes;
          v.stock = countAvailableCodes(serialCodes);
        }
        return v;
      });
      data.variants = ensureVariantCodes(data.variants, data.productCode);
    }

    const { productImages, variantImageMap } = splitUploadedProductImages(req.files, data.variants?.length || 0);
    let images = productImages;
    if (Array.isArray(data.variants) && data.variants.length > 0) {
      data.variants = data.variants.map((variant, index) => ({
        ...variant,
        variantImages: [...(variant.variantImages || []), ...(variantImageMap[index] || [])]
      }));
    }

    const settings = await Setting.findOne();
    const metalRates = settings?.metalRates || {};
    const gstRate = settings?.gstRate || 0;

    const productData = applyMetalPricingToProduct(
      { ...data, productCode: data.productCode, slug: productSlug, images, isSerialized: true },
      metalRates,
      gstRate
    );

    const product = await Product.create(productData);

    const stockLogs = product.variants.map(v => ({
      productId:     product._id,
      variantId:     v._id,
      changeType:    "purchase",
      previousStock: 0,
      newStock:      v.stock,
      change:        v.stock,
      reason:        "Initial stock entry",
      adminId:       req.user.userId,
    }));
    await StockLog.insertMany(stockLogs);

    return success(res, { product }, "Product created successfully", 201);
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// GET /api/admin/products
// ─────────────────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    // BUG-13 FIX: cap limit to 100 to prevent memory-exhaustion attacks
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const { search, category, status, minPrice, maxPrice, inStock, sortBy, sellerId } = req.query;

    const query = {};
    if (search) {
      // BUG-21 FIX (also applied here): escape special regex characters
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escaped, $options: "i" };
    }
    if (category) query.categories = category;
    if (status)   query.status = status;
    if (sellerId) query.sellerId = sellerId;

    // Advanced Filters
    if (minPrice || maxPrice) {
      query["variants.price"] = {};
      if (minPrice) query["variants.price"].$gte = Number(minPrice);
      if (maxPrice) query["variants.price"].$lte = Number(maxPrice);
    }

    if (inStock === 'true') {
      query["variants.stock"] = { $gt: 0 };
    } else if (inStock === 'false') {
      query["variants.stock"] = { $lte: 0 };
    }

    // Sort Options
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_low') sortOptions = { "variants.price": 1 };
    else if (sortBy === 'price_high') sortOptions = { "variants.price": -1 };
    else if (sortBy === 'name_asc') sortOptions = { name: 1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("categories",    "name")
        .sort(sortOptions)
        .limit(limit)
        .skip((page - 1) * limit),
      Product.countDocuments(query),
    ]);

    return success(res, {
      products: products.map((product) => normalizeProductForResponse(product)),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    }, "Products retrieved");
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// GET /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────
exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categories",    "name");
    if (!product) return error(res, "Product not found", 404);
    return success(res, { product: normalizeProductForResponse(product) }, "Product details retrieved");
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// PATCH /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return error(res, "Product not found", 404);
    const originalReferencedImages = collectReferencedImageUrls(product.toObject ? product.toObject() : product);

    const data = { ...req.body };
    if (data.categories) {
      if (Array.isArray(data.categories)) {
        data.categories = data.categories.length > 0 ? [data.categories[0]] : [];
      } else if (typeof data.categories === "string") {
        data.categories = [data.categories];
      }
    }

    // Handle slug update if name changes
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    } else if (data.slug) {
      data.slug = slugify(data.slug);
    }
    if (data.productCode) {
      const existingProductCode = await Product.findOne({ productCode: data.productCode, _id: { $ne: product._id } }).select("_id");
      if (existingProductCode) return error(res, "Product code already exists.", 409);
    } else if (!product.productCode) {
      data.productCode = await generateUniqueProductCode(Product);
    }

    const deletedImages = Array.isArray(data.deletedImages) ? data.deletedImages.filter(Boolean) : [];
    if (deletedImages.length > 0) {
      product.images = (product.images || []).filter((img) => !deletedImages.includes(img));
    }

    // Append new images (don't allow overwrite via body)
    const { productImages, variantImageMap } = splitUploadedProductImages(req.files, data.variants?.length || product.variants?.length || 0);

    if (productImages.length > 0) {
      const newImages = productImages;
      product.images = [...product.images, ...newImages];
    }

    // BUG-10 FIX: only apply whitelisted fields — prevents prototype pollution / field injection
    PRODUCT_UPDATE_WHITELIST.forEach(key => {
      if (data[key] !== undefined) product[key] = data[key];
    });

    if (Array.isArray(product.variants)) {
      product.variants = normalizeVariantFields(product.variants, {
        weight: product.weight,
        weightUnit: product.weightUnit
      }).map(v => {
        const serialCodes = normalizeSerialCodes(v.serialCodes || []);
        if (serialCodes.length > 0) {
          v.serialCodes = serialCodes;
          v.stock = countAvailableCodes(serialCodes);
        }
        return v;
      });
      product.variants = product.variants.map((variant, index) => ({
        ...variant,
        variantImages: [...(variant.variantImages || []), ...(variantImageMap[index] || [])]
      }));
      product.variants = ensureVariantCodes(product.variants, product.productCode || data.productCode || "");
    }

    product.isSerialized = true;

    const nextReferencedImages = collectReferencedImageUrls(product);
    const removedImageUrls = [...originalReferencedImages].filter((imageUrl) => !nextReferencedImages.has(imageUrl));

    const settings = await Setting.findOne();
    const metalRates = settings?.metalRates || {};
    const gstRate = settings?.gstRate || 0;
    applyMetalPricingToProduct(product, metalRates, gstRate);

    await product.save();

    if (removedImageUrls.length > 0) {
      await Promise.allSettled(
        removedImageUrls.map((imageUrl) => deleteFromCloudinary(imageUrl))
      );
    }

    return success(res, { product }, "Product updated successfully");
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// DELETE /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return error(res, "Product not found", 404);

    // BUG-07 FIX: cascade cleanup to prevent orphaned data
    await Promise.all([
      // Remove reviews for this product
      Review.deleteMany({ productId: product._id }),
      // Remove from homepage sections (set productId to null)
      HomepageSection.updateMany(
        { "items.productId": product._id },
        { $pull: { items: { productId: product._id } } }
      ),
      // Remove stock logs (historical data, safe to archive but fine to delete)
      StockLog.deleteMany({ productId: product._id }),
    ]);

    await product.deleteOne();

    return success(res, {}, "Product and associated data deleted successfully");
  } catch (err) { return error(res, err.message); }
};

// ─────────────────────────────────────────────────────────────────
// PATCH /api/admin/products/:id/toggle-status
// ─────────────────────────────────────────────────────────────────
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return error(res, "Product not found", 404);

    product.active = product.active === false ? true : false;
    await product.save();

    return success(res, { active: product.active }, `Product ${product.active ? 'activated' : 'deactivated'} successfully`);
  } catch (err) { return error(res, err.message); }
};
// ─────────────────────────────────────────────────────────────────
// PATCH /api/admin/products/bulk/prices
// ─────────────────────────────────────────────────────────────────
exports.bulkPriceUpdate = async (req, res) => {
  try {
    const { categoryId, productIds = [], type, value } = req.body;

    const numericValue = Number(value);
    if (!type || Number.isNaN(numericValue) || numericValue <= 0) {
      return error(res, "A valid positive 'value' and 'type' are required.", 400);
    }

    const allowedTypes = [
      "increase_amount",
      "decrease_amount",
      "increase_percent",
      "decrease_percent",
      "set_price"
    ];
    if (!allowedTypes.includes(type)) {
      return error(res, "Invalid update type provided.", 400);
    }

    const query = {};
    if (Array.isArray(productIds) && productIds.length > 0) {
      query._id = { $in: productIds };
    } else if (categoryId) {
      query.categories = categoryId;
    }

    const products = await Product.find(query);

    for (const prod of products) {
      prod.variants = prod.variants.map(v => {
        let newPrice = v.price;
        let newMrp = v.mrp;

        switch (type) {
          case "increase_amount":
            newPrice = v.price + numericValue;
            newMrp = v.mrp + numericValue;
            break;
          case "decrease_amount":
            newPrice = v.price - numericValue;
            newMrp = v.mrp - numericValue;
            break;
          case "increase_percent":
            newPrice = Math.round(v.price * (1 + numericValue / 100));
            newMrp = Math.round(v.mrp * (1 + numericValue / 100));
            break;
          case "decrease_percent":
            newPrice = Math.round(v.price * (1 - numericValue / 100));
            newMrp = Math.round(v.mrp * (1 - numericValue / 100));
            break;
          case "set_price":
            newPrice = numericValue;
            newMrp = Math.max(v.mrp, newPrice);
            break;
          default:
            break;
        }

        // Prevent non-positive values
        newPrice = Math.max(1, newPrice);
        newMrp = Math.max(newPrice, newMrp);

        v.price = newPrice;
        v.mrp = newMrp;

        if (v.mrp && v.mrp > v.price) {
          v.discount = Math.round(((v.mrp - v.price) / v.mrp) * 100);
        } else {
          v.discount = 0;
        }
        return v;
      });
      await prod.save();
    }

    return success(res, { count: products.length }, "Bulk price update complete");
  } catch (err) { return error(res, err.message); }
};
