const Product = require("../../../models/Product");
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
    }

    const product = await Product.create({
      ...data,
      sellerId,
      slug: productSlug,
      images,
      status: "Draft" // New seller products require admin approval/audit in production
    });

    return success(res, { product }, "Product created successfully. Awaiting review.", 201);
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
