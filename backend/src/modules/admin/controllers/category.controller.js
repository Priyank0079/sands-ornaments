const Category = require("../../../models/Category");
const Subcategory = require("../../../models/Subcategory");
const slugify = require("../../../utils/slugify");
const { success, error } = require("../../../utils/apiResponse");

// ── CATEGORIES ───────────────────────────────────────────────────────────────

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, showInNavbar, showInCollection, sortOrder, isActive } = req.body;
    
    // Auto-generate slug if not provided
    const categorySlug = slug ? slugify(slug) : slugify(name);

    const existing = await Category.findOne({ slug: categorySlug });
    if (existing) return error(res, "Category with this slug already exists.", 409);

    const category = await Category.create({
      name,
      slug: categorySlug,
      description,
      showInNavbar: showInNavbar !== undefined ? showInNavbar : true,
      showInCollection: showInCollection !== undefined ? showInCollection : true,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      image: req.file ? req.file.path : null, // Cloudinary URL
    });

    return success(res, { category }, "Category created successfully", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("subcategories")
      .sort({ sortOrder: 1, createdAt: -1 });
    return success(res, { categories }, "Categories retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("subcategories");
    if (!category) return error(res, "Category not found", 404);
    return success(res, { category }, "Category retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, showInNavbar, showInCollection, sortOrder, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) return error(res, "Category not found", 404);

    if (name) category.name = name;
    if (slug) category.slug = slugify(slug);
    else if (name) category.slug = slugify(name);
    
    if (description !== undefined) category.description = description;
    if (showInNavbar !== undefined) category.showInNavbar = showInNavbar;
    if (showInCollection !== undefined) category.showInCollection = showInCollection;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();
    return success(res, { category }, "Category updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return error(res, "Category not found", 404);
    
    // Also delete all associated subcategories
    await Subcategory.deleteMany({ parentCategory: id });

    return success(res, {}, "Category and all its subcategories deleted");
  } catch (err) { return error(res, err.message); }
};

// ── SUBCATEGORIES ────────────────────────────────────────────────────────────

exports.createSubcategory = async (req, res) => {
  try {
    const { name, slug, parentCategory, isActive, sortOrder } = req.body;

    const parent = await Category.findById(parentCategory);
    if (!parent) return error(res, "Parent Category not found", 404);

    const subSlug = slug ? slugify(slug) : slugify(name);

    const subcategory = await Subcategory.create({
      name,
      slug: subSlug,
      parentCategory,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    });

    // Add reference to parent category
    parent.subcategories.push(subcategory._id);
    await parent.save();

    return success(res, { subcategory }, "Subcategory created successfully", 201);
  } catch (err) { return error(res, err.message); }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive, sortOrder } = req.body;

    const subcat = await Subcategory.findById(id);
    if (!subcat) return error(res, "Subcategory not found", 404);

    if (name) subcat.name = name;
    if (slug) subcat.slug = slugify(slug);
    else if (name) subcat.slug = slugify(name);

    if (isActive !== undefined) subcat.isActive = isActive;
    if (sortOrder !== undefined) subcat.sortOrder = sortOrder;

    await subcat.save();
    return success(res, { subcat }, "Subcategory updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcat = await Subcategory.findByIdAndDelete(id);
    if (!subcat) return error(res, "Subcategory not found", 404);

    // Remove reference from parent category
    await Category.updateOne(
      { _id: subcat.parentCategory },
      { $pull: { subcategories: id } }
    );

    return success(res, {}, "Subcategory deleted");
  } catch (err) { return error(res, err.message); }
};
