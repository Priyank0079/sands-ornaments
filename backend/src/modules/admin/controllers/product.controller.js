const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const Review = require("../../../models/Review");
const HomepageSection = require("../../../models/HomepageSection");
const slugify = require("../../../utils/slugify");
const { deleteFromCloudinary } = require("../../../utils/cloudinaryUtils");
const { success, error } = require("../../../utils/apiResponse");

// BUG-10 FIX: explicit whitelist of fields that can be updated via API
const PRODUCT_UPDATE_WHITELIST = [
  "name", "description", "slug", "tags", "stylingTips",
  "variants", "status", "categories", "sellerId",
  "isFeatured", "isTrending", "isNewArrival",
  "returnEligibilities", "weight", "material", "faqs",
  "showInNavbar", "showInCollection", "active"
];


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
    const { search, category, status, minPrice, maxPrice, inStock, sortBy } = req.query;

    const query = {};
    if (search) {
      // BUG-21 FIX (also applied here): escape special regex characters
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escaped, $options: "i" };
    }
    if (category) query.categories = category;
    if (status)   query.status = status;

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
      .populate("categories",    "name");
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

    // Handle specific image deletions
    if (data.deletedImages && Array.isArray(data.deletedImages)) {
      for (const imageUrl of data.deletedImages) {
        try {
          await deleteFromCloudinary(imageUrl);
          product.images = product.images.filter(img => img !== imageUrl);
        } catch (err) {
          console.error(`Failed to delete image ${imageUrl} from Cloudinary:`, err);
        }
      }
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
