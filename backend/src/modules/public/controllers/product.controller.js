const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

/**
 * GET /api/products
 * Query Params: search, category, subcategory, minPrice, maxPrice, tags, sort, page, limit
 */
exports.getProducts = async (req, res) => {
  try {
    const { 
      search, category, minPrice, maxPrice, 
      tags, sort, page = 1, limit = 20 
    } = req.query;

    const query = { status: "Active", active: { $ne: false } };

    // 1. Text Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 2. Category Filter
    if (category) query.categories = category;

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

    // 6. Execute Query with Pagination
    const products = await Product.find(query)
      .select("name slug brand images variants tags rating reviewCount categories")
      .populate("categories", "name")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    return success(res, {
      products,
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
 */
exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: "Active", active: { $ne: false } })
      .populate("categories", "name");

    if (!product) return error(res, "Product not found", 404);

    return success(res, { product }, "Product details retrieved");
  } catch (err) { return error(res, err.message); }
};

/**
 * GET /api/search/suggestions
 * Returns minimal product names matching search query
 */
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return success(res, { suggestions: [] });

    const suggestions = await Product.find({ 
      status: "Active",
      active: { $ne: false },
      name: { $regex: q, $options: "i" } 
    })
    .select("name slug images")
    .limit(10);

    return success(res, { suggestions });
  } catch (err) { return error(res, err.message); }
};
