const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const slugify = require("../../../utils/slugify");
const { success, error } = require("../../../utils/apiResponse");

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    const sellerId = req.user.userId;

    const productSlug = data.slug ? slugify(data.slug) : slugify(data.name);
    
    const existing = await Product.findOne({ slug: productSlug });
    if (existing) return error(res, "Product slug already exists.", 409);

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    } else if (data.image) {
      // Fallback for cases where images are sent as URLs/Placeholders (e.g. from AddProduct.jsx currently)
      images = [data.image];
    }

    // Ensure variants array exists (for seller dashboard simple form)
    if (!data.variants || data.variants.length === 0) {
       data.variants = [{
          name: "Standard",
          mrp: parseFloat(data.originalPrice) || 0,
          price: parseFloat(data.price || data.sellingPrice) || 0,
          stock: parseInt(data.availableStock || data.quantity) || 0,
          discount: parseInt(data.discount) || 0
       }];
    }

    const product = await Product.create({
      ...data,
      sellerId,
      slug: productSlug,
      images,
      status: "Active", // Enable auto-activation for now as per plan
      active: true
    });

    // Create Initial Stock Logs
    if (product.variants && product.variants.length > 0) {
      const stockLogs = product.variants.map(v => ({
        productId: product._id,
        variantId: v._id,
        changeType: "purchase", // or "initial"
        previousStock: 0,
        newStock: v.stock,
        change: v.stock,
        reason: "Initial seller listing",
        sellerId: sellerId
      }));
      await StockLog.insertMany(stockLogs);
    }

    return success(res, { product }, "Product created successfully.", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.userId }).sort({ createdAt: -1 });
    return success(res, { products });
  } catch (err) { return error(res, err.message); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const sellerId = req.user.userId;

    const product = await Product.findOne({ _id: id, sellerId });
    if (!product) return error(res, "Product not found or access denied", 404);

    if (data.name && !data.slug) data.slug = slugify(data.name);
    else if (data.slug) data.slug = slugify(data.slug);

    if (req.files && req.files.length > 0) {
      product.images = [...product.images, ...req.files.map(f => f.path)];
    }

    Object.assign(product, data);
    await product.save();

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
