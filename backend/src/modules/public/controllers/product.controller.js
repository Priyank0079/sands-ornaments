const Product = require("../../../models/Product");
const Category = require("../../../models/Category");
const Seller = require("../../../models/Seller");
const mongoose = require("mongoose");
const { success, error } = require("../../../utils/apiResponse");
const { normalizeProductForResponse } = require("../../../utils/productCompatibility");

const getApprovedSellerScope = async () => {
  const approvedSellers = await Seller.find({ status: "APPROVED" }).select("_id").lean();
  const approvedSellerIds = approvedSellers.map((seller) => seller._id);

  return approvedSellerIds.length
    ? {
        $or: [
          { sellerId: null },
          { sellerId: { $exists: false } },
          { sellerId: { $in: approvedSellerIds } }
        ]
      }
    : {
        $or: [{ sellerId: null }, { sellerId: { $exists: false } }]
      };
};

/**
 * GET /api/products
 * Query Params: search, category, subcategory, minPrice, maxPrice, tags, sort, page, limit
 */
exports.getProducts = async (req, res) => {
  try {
    const { 
      search, category, minPrice, maxPrice, 
      tags, sort, inStockOnly = "false", page = 1, limit = 20 
    } = req.query;

    const query = { status: "Active", active: { $ne: false } };
    const andFilters = [await getApprovedSellerScope()];

    // 1. Text Search
    if (search) {
      andFilters.push({
        $or: [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
        ]
      });
    }

    // 2. Category Filter
    if (category) {
      let categoryId = category;
      if (!mongoose.isValidObjectId(category)) {
        const resolved = await Category.findOne({
          $or: [{ slug: category }, { name: new RegExp(`^${category}$`, "i") }],
          isActive: true
        }).select("_id");
        categoryId = resolved?._id || category;
      }
      query.categories = categoryId;
    }

    // 3. Price Range Filter (matches any variant price)
    if (minPrice || maxPrice) {
      query["variants.price"] = {};
      if (minPrice) query["variants.price"].$gte = Number(minPrice);
      if (maxPrice) query["variants.price"].$lte = Number(maxPrice);
    }

    // 4. Tags Filter (e.g. tags=isTrending,isNewArrival)
    if (tags) {
      const tagList = tags.split(",");
      tagList.forEach(t => {
        if (["isNewArrival", "isMostGifted", "isNewLaunch", "isTrending", "isPremium"].includes(t)) {
          query[`tags.${t}`] = true;
        }
      });
    }

    if (String(inStockOnly).toLowerCase() === "true") {
      query["variants.stock"] = { $gt: 0 };
    }

    // 5. Sorting
    let sortOption = { createdAt: -1 }; // Default: Newest
    if (sort) {
      switch (sort) {
        case "priceLtoH": sortOption = { "variants.0.price": 1 }; break;
        case "priceHtoL": sortOption = { "variants.0.price": -1 }; break;
        case "rating":    sortOption = { rating: -1 }; break;
        case "newest":    sortOption = { createdAt: -1 }; break;
      }
    }

    if (andFilters.length) {
      query.$and = andFilters;
    }

    // 6. Execute Query with Pagination
    const products = await Product.find(query)
      .select("name slug productCode brand images videoUrl variants tags rating reviewCount categories category categorySlug categoryId navShopByCategory weight weightUnit goldCategory silverCategory material audience")
      .populate("categories", "name slug")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    return success(res, {
      products: products.map((product) => normalizeProductForResponse(product)),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    }, "Products retrieved successfully");

  } catch (err) { return error(res, err.message); }
};

/**
 * GET /api/products/:slug
 * Supports slug or ObjectId.
 */
exports.getProductDetail = async (req, res) => {
  try {
    const identifier = req.params.slug;
    const baseQuery = { status: "Active", active: { $ne: false } };
    const inStockOnly = String(req.query?.inStockOnly || "false").toLowerCase() === "true";
    const lookup = mongoose.isValidObjectId(identifier)
      ? { ...baseQuery, _id: identifier }
      : { ...baseQuery, slug: identifier };

    const product = await Product.findOne(lookup)
      .populate("categories", "name slug")
      .populate("sellerId", "shopName");

    if (!product) return error(res, "Product not found", 404);

    if (product.sellerId) {
      const seller = await Seller.findById(product.sellerId).select("status").lean();
      if (!seller || seller.status !== "APPROVED") {
        return error(res, "Product not found", 404);
      }
    }

    if (inStockOnly) {
      const hasStock = (product.variants || []).some((variant) => Number(variant?.stock || 0) > 0);
      if (!hasStock) return error(res, "Product not found", 404);
    }

    return success(res, { product: normalizeProductForResponse(product) }, "Product details retrieved");
  } catch (err) { return error(res, err.message); }
};

/**
 * GET /api/public/products/by-ids?ids=a,b,c&inStockOnly=false
 * Returns products in the same order as requested ids (when possible).
 * Use this for pinned CMS sections so they don't disappear due to catalogue paging.
 */
exports.getProductsByIds = async (req, res) => {
  try {
    const idsParam = String(req.query?.ids || "").trim();
    if (!idsParam) return success(res, { products: [] });

    const ids = idsParam
      .split(",")
      .map((id) => String(id || "").trim())
      .filter((id) => mongoose.isValidObjectId(id));

    if (ids.length === 0) return success(res, { products: [] });

    const approvedScope = await getApprovedSellerScope();
    const query = {
      status: "Active",
      active: { $ne: false },
      _id: { $in: ids },
      ...approvedScope
    };

    const inStockOnly = String(req.query?.inStockOnly || "false").toLowerCase() === "true";
    if (inStockOnly) {
      query["variants.stock"] = { $gt: 0 };
    }

    const found = await Product.find(query)
      .select("name slug productCode brand images videoUrl variants tags rating reviewCount categories category categorySlug categoryId navShopByCategory weight weightUnit goldCategory silverCategory material audience")
      .populate("categories", "name slug")
      .lean();

    const foundMap = new Map(found.map((p) => [String(p._id), p]));
    const ordered = ids.map((id) => foundMap.get(String(id))).filter(Boolean);

    return success(res, {
      products: ordered.map((product) => normalizeProductForResponse(product))
    });
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * GET /api/search/suggestions
 * Returns minimal product names matching search query
 */
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return success(res, { suggestions: [] });

    const approvedSellerScope = await getApprovedSellerScope();
    const suggestions = await Product.find({
      status: "Active",
      active: { $ne: false },
      name: { $regex: q, $options: "i" },
      ...approvedSellerScope
    })
    .select("name slug images")
    .limit(10);

    return success(res, { suggestions });
  } catch (err) { return error(res, err.message); }
};
