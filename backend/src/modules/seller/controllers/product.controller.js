const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const slugify = require("../../../utils/slugify");
const { deleteFromCloudinary } = require("../../../utils/cloudinaryUtils");
const { success, error } = require("../../../utils/apiResponse");
const Seller = require("../../../models/Seller");
const Setting = require("../../../models/Setting");
const { applyMetalPricingToProduct } = require("../../../utils/metalPricing");
const { generateUniqueProductCode, generateVariantCode } = require("../../../utils/productIdentity");
const { normalizeProductForResponse } = require("../../../utils/productCompatibility");

const normalizeCategories = (categories) => {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories.filter(Boolean).slice(0, 1);
  return [categories].filter(Boolean).slice(0, 1);
};

const normalizeMaterial = (data) => {
  if (data.material) return data.material;
  if (data.metal) return data.metal;
  if (data.metalType) return data.metalType;
  return data.material;
};

const sanitizeVariants = (variants, fallback = {}) => {
  if (!Array.isArray(variants)) return [];
  const fallbackWeight = fallback.weight !== undefined && fallback.weight !== null
    ? Number(fallback.weight) || 0
    : undefined;
  const fallbackWeightUnit = fallback.weightUnit || "Grams";

  return variants.map(v => ({
    name: v.name || "Standard",
    variantCode: v.variantCode || "",
    variantImages: Array.isArray(v.variantImages)
      ? v.variantImages.filter(Boolean)
      : [],
    variantFaqs: Array.isArray(v.variantFaqs)
      ? v.variantFaqs.map((faq) => ({
        question: String(faq?.question || "").trim(),
        answer: String(faq?.answer || "").trim()
      })).filter((faq) => faq.question || faq.answer)
      : [],
    mrp: Number(v.mrp) || 0,
    price: Number(v.price) || 0,
    stock: Number(v.stock) || 0,
    discount: Number(v.discount) || 0,
    weight: v.weight !== undefined && v.weight !== null && v.weight !== ""
      ? Number(v.weight) || 0
      : fallbackWeight,
    weightUnit: v.weightUnit || fallbackWeightUnit,
    makingCharge: Number(v.makingCharge) || 0,
    diamondPrice: Number(v.diamondPrice) || 0,
    metalPrice: Number(v.metalPrice) || 0,
    gst: Number(v.gst) || 0,
    finalPrice: Number(v.finalPrice) || 0,
    serialCodes: normalizeSerialCodes(v.serialCodes || [])
  }));
};

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

const ensureVariantCodes = (variants = [], productCode = "") => {
  const existingCodes = new Set(
    variants
      .map(variant => variant.variantCode)
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

exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    const sellerId = req.user.userId;

    // Helper to safety parse JSON
    const tryParse = (val) => {
      if (typeof val !== 'string') return val;
      try { return JSON.parse(val); } catch (e) { return val; }
    };

    // Parse all potentially stringified JSON fields
    const categories = normalizeCategories(tryParse(data.categories));
    const variants = sanitizeVariants(tryParse(data.variants), {
      weight: data.weight,
      weightUnit: data.weightUnit
    });
    const tags = tryParse(data.tags) || {};
    const faqs = tryParse(data.faqs) || [];
    const navGiftsFor = tryParse(data.navGiftsFor) || [];
    const navOccasions = tryParse(data.navOccasions) || [];
    const material = normalizeMaterial(data);
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Sanitize unique fields to prevent duplicate "" key errors
    if (!data.productCode) {
      data.productCode = await generateUniqueProductCode(Product);
    }
    if (!data.sku) delete data.sku;
    if (!data.huid) delete data.huid;
    const existingProductCode = await Product.findOne({ productCode: data.productCode }).select("_id");
    if (existingProductCode) return error(res, "Product code already exists.", 409);

    // Update data with parsed objects for standard creation
    data.categories = categories;
    data.variants = variants;
    data.tags = tags;
    data.faqs = faqs;
    data.navGiftsFor = navGiftsFor;
    data.navOccasions = navOccasions;
    data.isSerialized = true;
    
    // Ensure slug is clean
    data.slug = baseSlug;

    let images = [];
    const { productImages, variantImageMap } = splitUploadedProductImages(req.files, data.variants?.length || 0);
    if (productImages.length > 0) {
      images = productImages;
    } else if (data.image) {
      images = [data.image];
    } else if (data.images) {
      images = tryParse(data.images);
      if (!Array.isArray(images)) images = [data.images].filter(Boolean);
    }

    const existing = await Product.findOne({ slug: baseSlug });
    const finalSlug = existing ? `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}` : baseSlug;

    if (!variants || variants.length === 0) {
      data.variants = [{
        name: "Standard",
        mrp: parseFloat(data.originalPrice) || 0,
        price: parseFloat(data.price || data.sellingPrice) || 0,
        stock: parseInt(data.availableStock || data.quantity || data.stock) || 0,
        discount: parseInt(data.discount) || 0,
        weight: data.weight !== undefined && data.weight !== null && data.weight !== ""
          ? Number(data.weight) || 0
          : 0,
        weightUnit: data.weightUnit || "Grams",
        serialCodes: []
      }];
    } else {
      data.variants = variants.map(v => {
        const serialCodes = normalizeSerialCodes(v.serialCodes || []);
        const availableCount = serialCodes.length > 0 ? countAvailableCodes(serialCodes) : Number(v.stock) || 0;
        return { ...v, serialCodes, stock: availableCount };
      });
    }
    data.variants = data.variants.map((variant, index) => ({
      ...variant,
      variantImages: [...(variant.variantImages || []), ...(variantImageMap[index] || [])]
    }));
    data.variants = ensureVariantCodes(data.variants, data.productCode);

    const seller = await Seller.findById(sellerId);
    const settings = await Setting.findOne();
    const metalRates = seller?.metalRates || {};
    const gstRate = settings?.gstRate || 0;

    const productData = applyMetalPricingToProduct({
      ...data,
      sellerId,
      slug: finalSlug,
      images,
      categories,
      material,
      productCode: data.productCode,
      status: "Active",
      active: true,
      isSerialized: true
    }, metalRates, gstRate);

    const product = await Product.create(productData);

    if (product.variants && product.variants.length > 0) {
      const stockLogs = product.variants.map(v => ({
        productId: product._id,
        variantId: v._id,
        changeType: "purchase",
        previousStock: 0,
        newStock: v.stock,
        change: v.stock,
        reason: "Initial seller listing",
        sellerId: sellerId
      }));
      await StockLog.insertMany(stockLogs);
    }

    return success(res, { product }, "Product created successfully.", 201);
  } catch (err) { 
    console.error("❌ CREATE PRODUCT ERROR:", err);
    return error(res, err.message); 
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.userId })
      .populate("categories", "name slug")
      .sort({ createdAt: -1 });
    return success(res, { products: products.map((product) => normalizeProductForResponse(product)) });
  } catch (err) { return error(res, err.message); }
};

exports.getMyProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.userId })
      .populate("categories", "name slug");
    if (!product) return error(res, "Product not found", 404);
    return success(res, { product: normalizeProductForResponse(product) });
  } catch (err) { return error(res, err.message); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const sellerId = req.user.userId;

    const product = await Product.findOne({ _id: id, sellerId });
    if (!product) return error(res, "Product not found or access denied", 404);
    const originalReferencedImages = collectReferencedImageUrls(product.toObject ? product.toObject() : product);

    if (data.name && !data.slug) data.slug = slugify(data.name);
    else if (data.slug) data.slug = slugify(data.slug);

    if (data.slug) {
      const existing = await Product.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) return error(res, "Product slug already exists.", 409);
    }

    const { productImages, variantImageMap } = splitUploadedProductImages(req.files, data.variants?.length || product.variants?.length || 0);

    if (productImages.length > 0) {
      product.images = [...product.images, ...productImages];
    }

    const deletedImages = Array.isArray(data.deletedImages) ? data.deletedImages.filter(Boolean) : [];
    if (deletedImages.length > 0) {
      product.images = (product.images || []).filter((img) => !deletedImages.includes(img));
    }

    const safeData = { ...data };
    delete safeData.rating;
    delete safeData.reviewCount;
    delete safeData.sellerId;
    delete safeData.createdAt;
    delete safeData.updatedAt;
    delete safeData.__v;
    delete safeData.deletedImages;

    // Sanitize unique fields to prevent duplicate "" key errors
    if (!safeData.productCode) delete safeData.productCode;
    if (!safeData.sku) delete safeData.sku;
    if (!safeData.huid) delete safeData.huid;
    if (safeData.productCode) {
      const duplicateCode = await Product.findOne({ productCode: safeData.productCode, _id: { $ne: id } }).select("_id");
      if (duplicateCode) return error(res, "Product code already exists.", 409);
    } else if (!product.productCode) {
      safeData.productCode = await generateUniqueProductCode(Product);
    }

    if (safeData.categories !== undefined) {
      safeData.categories = normalizeCategories(safeData.categories);
    }
    if (safeData.material !== undefined || safeData.metal !== undefined || safeData.metalType !== undefined) {
      safeData.material = normalizeMaterial(safeData);
    }
    Object.assign(product, safeData);
    if (Array.isArray(product.variants)) {
      product.variants = sanitizeVariants(product.variants, {
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
      product.variants = ensureVariantCodes(product.variants, product.productCode || safeData.productCode || "");
    }
    product.isSerialized = true;

    const nextReferencedImages = collectReferencedImageUrls(product);
    const removedImageUrls = [...originalReferencedImages].filter((imageUrl) => !nextReferencedImages.has(imageUrl));

    const seller = await Seller.findById(sellerId);
    const settings = await Setting.findOne();
    const metalRates = seller?.metalRates || {};
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.userId });
    if (!product) return error(res, "Product not found", 404);
    return success(res, {}, "Product deleted");
  } catch (err) { return error(res, err.message); }
};

exports.scanProduct = async (req, res) => {
  try {
    const { productCode } = req.body;
    const sellerId = req.user.userId;
    if (!productCode) return error(res, "Product code is required", 400);

    const product = await Product.findOne({
      sellerId,
      "variants.serialCodes.code": productCode
    });
    if (!product) return error(res, "Product not found", 404);

    const variant = product.variants.find(v =>
      Array.isArray(v.serialCodes) && v.serialCodes.some(c => c.code === productCode)
    );
    if (!variant) return error(res, "Variant not found", 404);

    const codeEntry = variant.serialCodes.find(c => c.code === productCode);
    if (!codeEntry) return error(res, "Product code not found", 404);
    if (codeEntry.status && codeEntry.status !== "AVAILABLE") {
      return error(res, "Product already sold", 400);
    }

    const previousStock = variant.stock || 0;
    codeEntry.status = "SOLD_OFFLINE";
    variant.stock = Math.max(0, previousStock - 1);

    await product.save();

    await StockLog.create({
      productId: product._id,
      variantId: variant._id,
      changeType: "sale",
      previousStock,
      newStock: variant.stock,
      change: -1,
      reason: `Offline sale - ${productCode}`,
      sellerId
    });

    return success(res, {
      name: product.name,
      price: variant.price,
      stock: variant.stock,
      productId: product._id,
      variantId: variant._id,
      productCode
    }, "Product sold successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
