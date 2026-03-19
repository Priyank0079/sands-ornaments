const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const { success, error } = require("../../../utils/apiResponse");

exports.getInventory = async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    const query = { sellerId: req.user.userId };

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escaped, $options: "i" };
    }
    if (category) query.categories = category;
    if (lowStock === "true") query["variants.stock"] = { $lte: 10 };

    const products = await Product.find(query)
      .select("name images variants categories sellerId")
      .populate("categories", "name");

    return success(res, { inventory: products }, "Inventory retrieved");
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

    const previousStock = variant.stock;
    variant.stock = Number(newStock);
    await product.save();

    await StockLog.create({
      productId,
      variantId,
      changeType: "adjustment",
      previousStock,
      newStock,
      change: newStock - previousStock,
      reason: reason || "Manual adjustment by Seller",
      sellerId: req.user.userId
    });

    return success(res, { product }, "Stock adjusted successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getStockHistory = async (req, res) => {
  try {
    const { productId, variantId } = req.query;
    const productQuery = { sellerId: req.user.userId };
    if (productId) productQuery._id = productId;

    const products = await Product.find(productQuery).select("_id");
    const productIds = products.map(p => p._id);
    if (productIds.length === 0) return success(res, { logs: [] }, "Stock history retrieved");

    const query = { productId: { $in: productIds } };
    if (variantId) query.variantId = variantId;

    const logs = await StockLog.find(query)
      .populate("productId", "name images")
      .populate("adminId", "name")
      .populate("sellerId", "fullName")
      .sort({ createdAt: -1 })
      .limit(50);

    return success(res, { logs }, "Stock history retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const products = await Product.find({
      sellerId: req.user.userId,
      "variants.stock": { $lte: threshold }
    })
      .select("name images categories variants")
      .populate("categories", "name");

    const alerts = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= threshold) {
          alerts.push({
            productId: p._id,
            productName: p.name,
            productImage: p.images?.[0] || '',
            categoryName: p.categories?.[0]?.name || 'Uncategorized',
            variantId: v._id,
            variantName: v.name,
            currentStock: v.stock,
            threshold
          });
        }
      });
    });

    return success(res, { alerts }, "Low stock alerts retrieved");
  } catch (err) { return error(res, err.message); }
};
