const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const slugify = require("../../../utils/slugify");
const { success, error } = require("../../../utils/apiResponse");

const normalizeCategories = (categories) => {
  if (!categories) return [];
  if (Array.isArray(categories)) return categories.filter(Boolean).slice(0, 1);
  return [categories].filter(Boolean).slice(0, 1);
};

const normalizeMaterial = (data) => {
  if (data.material) return data.material;
  if (data.metal) return data.metal;
  if (data.metalType) return data.metalType;
  return data.material;
};

const sanitizeVariants = (variants) => {
  if (!Array.isArray(variants)) return [];
  return variants.map(v => ({
    name: v.name || "Standard",
    mrp: Number(v.mrp) || 0,
    price: Number(v.price) || 0,
    stock: Number(v.stock) || 0,
    discount: Number(v.discount) || 0
  }));
};

exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    const sellerId = req.user.userId;

    // Helper to safety parse JSON
    const tryParse = (val) => {
      if (typeof val !== 'string') return val;
      try { return JSON.parse(val); } catch (e) { return val; }
    };

    // Parse all potentially stringified JSON fields
    const categories = normalizeCategories(tryParse(data.categories));
    const variants = sanitizeVariants(tryParse(data.variants));
    const tags = tryParse(data.tags) || {};
    const faqs = tryParse(data.faqs) || [];
    const navGiftsFor = tryParse(data.navGiftsFor) || [];
    const navOccasions = tryParse(data.navOccasions) || [];
    const productCodes = tryParse(data.productCodes);
    
    const isSerialized = productCodes && Array.isArray(productCodes) && productCodes.length > 0;
    const material = normalizeMaterial(data);
    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Sanitize unique fields to prevent duplicate "" key errors
    if (!data.productCode) delete data.productCode;
    if (!data.sku) delete data.sku;
    if (!data.huid) delete data.huid;

    // Update data with parsed objects for standard creation
    data.categories = categories;
    data.variants = variants;
    data.tags = tags;
    data.faqs = faqs;
    data.navGiftsFor = navGiftsFor;
    data.navOccasions = navOccasions;
    
    // Ensure slug is clean
    data.slug = baseSlug;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    } else if (data.image) {
      images = [data.image];
    } else if (data.images) {
      images = tryParse(data.images);
      if (!Array.isArray(images)) images = [data.images].filter(Boolean);
    }

    if (isSerialized) {
      // Create multiple products
      const productsToCreate = [];
      for (let i = 0; i < productCodes.length; i++) {
        const code = productCodes[i];
        const uniqueSlug = `${baseSlug}-${code}-${Math.floor(1000 + Math.random() * 9000)}`;

        const productData = {
          ...data,
          name: `${data.name} - ${code}`,
          sellerId,
          slug: uniqueSlug,
          productCode: code,
          sku: code,
          images,
          categories,
          material,
          status: "Active",
          active: true,
          variants: variants.length > 0 ? variants.map(v => ({ ...v, stock: 1 })) : [{
            name: "Standard",
            mrp: parseFloat(data.originalPrice) || 0,
            price: parseFloat(data.price || data.sellingPrice) || 0,
            stock: 1,
            discount: parseInt(data.discount) || 0
          }]
        };
        productsToCreate.push(productData);
      }

      const createdProducts = await Product.insertMany(productsToCreate);
      
      // Create Stock Logs for each
      const stockLogs = [];
      createdProducts.forEach(p => {
        p.variants.forEach(v => {
          stockLogs.push({
            productId: p._id,
            variantId: v._id,
            changeType: "purchase",
            previousStock: 0,
            newStock: v.stock,
            change: v.stock,
            reason: "Bulk serialized listing",
            sellerId: sellerId
          });
        });
      });
      await StockLog.insertMany(stockLogs);

      return success(res, { products: createdProducts }, `${createdProducts.length} products created successfully.`, 201);
    } else {
      // Single product creation (Standard)
      const existing = await Product.findOne({ slug: baseSlug });
      const finalSlug = existing ? `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}` : baseSlug;

      if (!variants || variants.length === 0) {
        data.variants = [{
          name: "Standard",
          mrp: parseFloat(data.originalPrice) || 0,
          price: parseFloat(data.price || data.sellingPrice) || 0,
          stock: parseInt(data.availableStock || data.quantity || data.stock) || 0,
          discount: parseInt(data.discount) || 0
        }];
      } else {
        data.variants = variants;
      }

      const product = await Product.create({
        ...data,
        sellerId,
        slug: finalSlug,
        images,
        categories,
        material,
        status: "Active",
        active: true
      });

      if (product.variants && product.variants.length > 0) {
        const stockLogs = product.variants.map(v => ({
          productId: product._id,
          variantId: v._id,
          changeType: "purchase",
          previousStock: 0,
          newStock: v.stock,
          change: v.stock,
          reason: "Initial seller listing",
          sellerId: sellerId
        }));
        await StockLog.insertMany(stockLogs);
      }

      return success(res, { product }, "Product created successfully.", 201);
    }
  } catch (err) { 
    console.error("❌ CREATE PRODUCT ERROR:", err);
    return error(res, err.message); 
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.userId })
      .populate("categories", "name slug")
      .sort({ createdAt: -1 });
    return success(res, { products });
  } catch (err) { return error(res, err.message); }
};

exports.getMyProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.userId })
      .populate("categories", "name slug");
    if (!product) return error(res, "Product not found", 404);
    return success(res, { product });
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

    if (data.slug) {
      const existing = await Product.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) return error(res, "Product slug already exists.", 409);
    }

    if (req.files && req.files.length > 0) {
      product.images = [...product.images, ...req.files.map(f => f.path)];
    }

    if (data.deletedImages && Array.isArray(data.deletedImages)) {
      product.images = product.images.filter(img => !data.deletedImages.includes(img));
    }

    const safeData = { ...data };
    delete safeData.rating;
    delete safeData.reviewCount;
    delete safeData.sellerId;
    delete safeData.createdAt;
    delete safeData.updatedAt;
    delete safeData.__v;
    delete safeData.deletedImages;

    // Sanitize unique fields to prevent duplicate "" key errors
    if (!safeData.productCode) delete safeData.productCode;
    if (!safeData.sku) delete safeData.sku;
    if (!safeData.huid) delete safeData.huid;

    if (safeData.categories !== undefined) {
      safeData.categories = normalizeCategories(safeData.categories);
    }
    if (safeData.material !== undefined || safeData.metal !== undefined || safeData.metalType !== undefined) {
      safeData.material = normalizeMaterial(safeData);
    }
    if (safeData.variants) safeData.variants = sanitizeVariants(safeData.variants);

    Object.assign(product, safeData);
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
