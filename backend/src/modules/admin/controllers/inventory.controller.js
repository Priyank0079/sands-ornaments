const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const { success, error } = require("../../../utils/apiResponse");

exports.getInventory = async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query["categories.categoryId"] = category;
    if (lowStock === "true") query["variants.stock"] = { $lte: 10 }; // Default low stock threshold

    const products = await Product.find(query)
      .select("name images variants categories")
      .populate("categories.categoryId", "name");

    return success(res, { inventory: products }, "Inventory retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.adjustStock = async (req, res) => {
  try {
    const { productId, variantId, newStock, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return error(res, "Product not found", 404);

    const variant = product.variants.id(variantId);
    if (!variant) return error(res, "Variant not found", 404);

    const previousStock = variant.stock;
    variant.stock = newStock;
    await product.save();

    // Log the manual adjustment
    await StockLog.create({
      productId,
      variantId,
      changeType: "adjustment",
      previousStock,
      newStock,
      change: newStock - previousStock,
      reason: reason || "Manual adjustment by Admin",
      adminId: req.user.userId
    });

    return success(res, { product }, "Stock adjusted successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getStockHistory = async (req, res) => {
  try {
    const { productId, variantId } = req.query;
    const query = {};
    if (productId) query.productId = productId;
    if (variantId) query.variantId = variantId;

    const logs = await StockLog.find(query)
      .populate("productId", "name")
      .populate("adminId", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    return success(res, { logs }, "Stock history retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const threshold = 5;
    const products = await Product.find({ "variants.stock": { $lte: threshold } })
      .select("name variants");
    
    const alerts = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= threshold) {
          alerts.push({ productName: p.name, variantName: v.name, currentStock: v.stock });
        }
      });
    });

    return success(res, { alerts }, "Low stock alerts retrieved");
  } catch (err) { return error(res, err.message); }
};
