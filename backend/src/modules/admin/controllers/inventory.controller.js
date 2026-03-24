const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const { success, error } = require("../../../utils/apiResponse");
const { isSerializedVariant, setSerializedVariantStock } = require("../../../utils/inventorySync");

exports.getInventory = async (req, res) => {
  try {
    const { search, category, lowStock } = req.query;
    const query = {};

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escaped, $options: "i" };
    }
    if (category) query.categories = category;
    if (lowStock === "true") query["variants.stock"] = { $lte: 10 }; // Default low stock threshold

    const products = await Product.find(query)
      .select("name images variants categories sellerId")
      .populate("categories", "name")
      .populate("sellerId", "fullName shopName");

    return success(res, { inventory: products }, "Inventory retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.adjustStock = async (req, res) => {
  try {
    const { productId, variantId, newStock, reason } = req.body;
    if (newStock === undefined || newStock === null || Number.isNaN(Number(newStock))) {
      return error(res, "Invalid stock value", 400);
    }

    const product = await Product.findById(productId);
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

    // Log the manual adjustment
    await StockLog.create({
      productId,
      variantId,
      changeType: "adjustment",
      previousStock,
      newStock: variant.stock,
      change: variant.stock - previousStock,
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
      .populate("productId", "name images sellerId")
      .populate("adminId", "name")
      .populate("sellerId", "fullName shopName")
      .sort({ createdAt: -1 })
      .limit(50);

    return success(res, { logs }, "Stock history retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const products = await Product.find({ "variants.stock": { $lte: threshold } })
      .select("name images categories variants sellerId")
      .populate("categories", "name")
      .populate("sellerId", "fullName shopName");
    
    const alerts = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        if (v.stock <= threshold) {
          alerts.push({
            productId: p._id,
            productName: p.name,
            productImage: p.images?.[0] || '',
            categoryName: p.categories?.[0]?.name || 'Uncategorized',
            sellerName: p.sellerId?.shopName || p.sellerId?.fullName || 'Admin',
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
