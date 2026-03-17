const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const Review = require("../../../models/Review");
const HomepageSection = require("../../../models/HomepageSection");
const slugify = require("../../../utils/slugify");
const { success, error } = require("../../../utils/apiResponse");

// BUG-10 FIX: explicit whitelist of fields that can be updated via API
const PRODUCT_UPDATE_WHITELIST = [
  "name", "description", "slug", "tags", "stylingTips",
  "variants", "status", "categories", "sellerId",
  "isFeatured", "isTrending", "isNewArrival",
  "returnEligibilities", "weight", "material",
];


// ─────────────────────────────────────────────────────────────────
// POST /api/admin/products
// ─────────────────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    const productSlug = data.slug ? slugify(data.slug) : slugify(data.name);
    const existing = await Product.findOne({ slug: productSlug });
    if (existing) return error(res, "Product with this slug already exists.", 409);

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    if (data.variants && data.variants.length > 0) {
      data.variants = data.variants.map(v => {
        if (v.mrp && v.price && !v.discount) {
          v.discount = Math.round(((v.mrp - v.price) / v.mrp) * 100);
        }
        return v;
      });
    }

    const product = await Product.create({ ...data, slug: productSlug, images });

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
    const { search, category, status } = req.query;

    const query = {};
    if (search) {
      // BUG-21 FIX (also applied here): escape special regex characters
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escaped, $options: "i" };
    }
    if (category) query["categories.categoryId"] = category;
    if (status)   query.status = status;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("categories.categoryId",    "name")
        .populate("categories.subcategoryId", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      Product.countDocuments(query),
    ]);

    return success(res, {
      products,
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
      .populate("categories.categoryId",    "name")
      .populate("categories.subcategoryId", "name");
    if (!product) return error(res, "Product not found", 404);
    return success(res, { product }, "Product details retrieved");
  } catch (err) { return error(res, err.message); }
};


// ─────────────────────────────────────────────────────────────────
// PATCH /api/admin/products/:id
// ─────────────────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return error(res, "Product not found", 404);

    const data = req.body;

    // Handle slug update if name changes
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    } else if (data.slug) {
      data.slug = slugify(data.slug);
    }

    // Append new images (don't allow overwrite via body)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      product.images = [...product.images, ...newImages];
    }

    // BUG-10 FIX: only apply whitelisted fields — prevents prototype pollution / field injection
    PRODUCT_UPDATE_WHITELIST.forEach(key => {
      if (data[key] !== undefined) product[key] = data[key];
    });

    await product.save();
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
// PATCH /api/admin/products/bulk/prices
// ─────────────────────────────────────────────────────────────────
exports.bulkPriceUpdate = async (req, res) => {
  try {
    const { categoryId, percentage, type } = req.body;

    if (!percentage || percentage <= 0 || percentage > 100) {
      return error(res, "Percentage must be a positive number between 1 and 100.", 400);
    }
    if (!["increase", "decrease"].includes(type)) {
      return error(res, "Type must be 'increase' or 'decrease'.", 400);
    }

    const query = categoryId ? { "categories.categoryId": categoryId } : {};
    const products = await Product.find(query);

    for (const prod of products) {
      prod.variants = prod.variants.map(v => {
        const factor = type === "increase" ? (1 + percentage / 100) : (1 - percentage / 100);
        // BUG-08 FIX: ensure price never drops below 1 (prevent negative/zero price)
        v.price = Math.max(1, Math.round(v.price * factor));
        // Recalculate discount percentage relative to MRP
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
