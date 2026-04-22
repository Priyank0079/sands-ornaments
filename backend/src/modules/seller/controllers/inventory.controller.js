const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const mongoose = require("mongoose");
const { success, error } = require("../../../utils/apiResponse");
const { isSerializedVariant, setSerializedVariantStock } = require("../../../utils/inventorySync");

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const toRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.getInventory = async (req, res) => {
  try {
    const {
      search,
      category,
      lowStock,
      threshold,
      sortBy = "updatedAt",
      sortOrder = "desc",
      page = 1,
      limit = 500
    } = req.query;

    const query = { sellerId: req.user.userId };
    const currentPage = parsePositiveInt(page, 1);
    const pageLimit = Math.min(parsePositiveInt(limit, 500), 1000);

    if (search) {
      const escaped = toRegex(search);
      query.name = { $regex: escaped, $options: "i" };
    }
    if (category) query.categories = category;
    if (lowStock === "true") {
      const lowStockThreshold = parsePositiveInt(threshold, 10);
      query["variants.stock"] = { $lte: lowStockThreshold };
    }

    const sortableFields = new Set(["name", "createdAt", "updatedAt"]);
    const safeSortBy = sortableFields.has(sortBy) ? sortBy : "updatedAt";
    const safeSortOrder = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("name images variants categories sellerId")
      .populate("categories", "name")
      .sort({ [safeSortBy]: safeSortOrder })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    return success(res, {
      inventory: products,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        pages: Math.ceil(total / pageLimit) || 1
      }
    }, "Inventory retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.adjustStock = async (req, res) => {
  try {
    const { productId, variantId, newStock, reason } = req.body;
    if (newStock === undefined || newStock === null || Number.isNaN(Number(newStock))) {
      return error(res, "Invalid stock value", 400);
    }

    const product = await Product.findOne({ _id: productId, sellerId: req.user.userId });
    if (!product) return error(res, "Product not found", 404);

    const variant = product.variants.id(variantId);
    if (!variant) return error(res, "Variant not found", 404);

    const nextStock = Number(newStock);
    if (nextStock < 0) {
      return error(res, "Stock cannot be negative", 400);
    }

    const previousStock = Number(variant.stock) || 0;
    const variantIndex = product.variants.findIndex(v => String(v._id) === String(variantId));

    if (isSerializedVariant(product, variant)) {
      setSerializedVariantStock({
        product,
        variant,
        desiredStock: nextStock,
        variantIndex
      });
    } else {
      variant.stock = nextStock;
    }

    await product.save();

    await StockLog.create({
      productId,
      variantId,
      changeType: "adjustment",
      previousStock,
      newStock: variant.stock,
      change: variant.stock - previousStock,
      reason: reason || "Manual adjustment by Seller",
      sellerId: req.user.userId
    });

    return success(res, { product }, "Stock adjusted successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getStockHistory = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      changeType,
      actorType,
      startDate,
      endDate,
      page = 1,
      limit = 500
    } = req.query;

    const currentPage = parsePositiveInt(page, 1);
    const pageLimit = Math.min(parsePositiveInt(limit, 500), 1000);
    const productQuery = { sellerId: req.user.userId };
    if (productId) productQuery._id = productId;

    const products = await Product.find(productQuery).select("_id");
    const productIds = products.map(p => p._id);
    if (productIds.length === 0) {
      return success(res, {
        logs: [],
        pagination: { total: 0, page: currentPage, limit: pageLimit, pages: 1 }
      }, "Stock history retrieved");
    }

    const query = { productId: { $in: productIds } };
    if (variantId) query.variantId = variantId;
    if (changeType) query.changeType = changeType;

    if (actorType === "admin") query.adminId = { $exists: true, $ne: null };
    if (actorType === "seller") query.sellerId = { $exists: true, $ne: null };
    if (actorType === "user") query.userId = { $exists: true, $ne: null };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await StockLog.countDocuments(query);

    const logs = await StockLog.find(query)
      .populate("productId", "name images sellerId")
      .populate({ path: "productId", populate: { path: "sellerId", select: "fullName shopName" } })
      .populate("adminId", "name")
      .populate("sellerId", "fullName shopName")
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    return success(res, {
      logs,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        pages: Math.ceil(total / pageLimit) || 1
      }
    }, "Stock history retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const {
      threshold = 5,
      search,
      category,
      sortBy = "currentStock",
      sortOrder = "asc",
      page = 1,
      limit = 500
    } = req.query;

    const currentPage = parsePositiveInt(page, 1);
    const pageLimit = Math.min(parsePositiveInt(limit, 500), 1000);
    const lowStockThreshold = parsePositiveInt(threshold, 5);

    const productMatch = { sellerId: new mongoose.Types.ObjectId(req.user.userId) };
    if (search) productMatch.name = { $regex: toRegex(search), $options: "i" };
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return error(res, "Invalid category id", 400);
      }
      productMatch.categories = new mongoose.Types.ObjectId(category);
    }

    const sortableFields = new Set(["currentStock", "productName", "variantName"]);
    const safeSortBy = sortableFields.has(sortBy) ? sortBy : "currentStock";
    const safeSortOrder = String(sortOrder).toLowerCase() === "desc" ? -1 : 1;

    const basePipeline = [
      { $match: productMatch },
      { $unwind: "$variants" },
      { $match: { "variants.stock": { $lte: lowStockThreshold } } },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDocs"
        }
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$name",
          productImage: { $ifNull: [{ $arrayElemAt: ["$images", 0] }, ""] },
          categoryName: {
            $ifNull: [{ $arrayElemAt: ["$categoryDocs.name", 0] }, "Uncategorized"]
          },
          variantId: "$variants._id",
          variantName: "$variants.name",
          currentStock: "$variants.stock",
          threshold: { $literal: lowStockThreshold }
        }
      }
    ];

    const countResult = await Product.aggregate([
      ...basePipeline,
      { $count: "total" }
    ]);
    const total = countResult[0]?.total || 0;

    const alerts = await Product.aggregate([
      ...basePipeline,
      { $sort: { [safeSortBy]: safeSortOrder, productName: 1 } },
      { $skip: (currentPage - 1) * pageLimit },
      { $limit: pageLimit }
    ]);

    return success(res, {
      alerts,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        pages: Math.ceil(total / pageLimit) || 1
      }
    }, "Low stock alerts retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.serializeStock = async (req, res) => {
  try {
    const { productId, variantId, productCodes } = req.body;
    const sellerId = req.user.userId;

    if (!Array.isArray(productCodes) || productCodes.length === 0) {
      return error(res, "Missing serial codes", 400);
    }

    const product = await Product.findOne({ _id: productId, sellerId });
    if (!product) return error(res, "Product not found", 404);

    const variant = product.variants.id(variantId);
    if (!variant) return error(res, "Variant not found", 404);

    if (variant.stock < productCodes.length) {
      return error(res, "Insufficient stock to serialize", 400);
    }

    // Capture original properties
    const originalStock = variant.stock;
    
    // Create new products based on the original template
    const productsToCreate = [];
    for (const code of productCodes) {
      const pData = product.toObject();
      delete pData._id;
      delete pData.__v;
      delete pData.createdAt;
      delete pData.updatedAt;
      
      const newProduct = {
        ...pData,
        name: `${product.name} - ${code}`,
        slug: `${product.slug}-${code}-${Math.floor(1000 + Math.random() * 9000)}`,
        productCode: code,
        sku: code,
        status: "Active",
        active: true,
        variants: pData.variants.map(v => ({
           ...v,
           _id: undefined, 
           stock: v._id.toString() === variantId.toString() ? 1 : 0
        }))
      };
      productsToCreate.push(newProduct);
    }

    const createResult = await Product.insertMany(productsToCreate);

    // Update original product stock
    variant.stock -= productCodes.length;
    await product.save();

    // Log the reduction on original
    await StockLog.create({
      productId,
      variantId,
      changeType: "adjustment",
      previousStock: originalStock,
      newStock: variant.stock,
      change: -productCodes.length,
      reason: "Converted items to individual serialized listings",
      sellerId
    });

    // Logs for new products
    const newStockLogs = [];
    createResult.forEach(p => {
       const v = p.variants.find(nv => nv.stock === 1);
       if(v) {
         newStockLogs.push({
           productId: p._id,
           variantId: v._id,
           changeType: "purchase",
           previousStock: 0,
           newStock: 1,
           change: 1,
           reason: "Individual item created from stock serialization",
           sellerId
         });
       }
    });
    if (newStockLogs.length > 0) {
      await StockLog.insertMany(newStockLogs);
    }

    return success(res, { newProducts: createResult }, `Successfully converted ${productCodes.length} items to serialized listings.`, 201);
  } catch (err) {
    return error(res, err.message);
  }
};
