const Category = require("../../../models/Category");
const { success, error } = require("../../../utils/apiResponse");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });
      
    return success(res, { categories }, "Categories retrieved successfully");
  } catch (err) { return error(res, err.message); }
};

exports.getCategoryDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) return error(res, "Category not found", 404);

    return success(res, { category }, "Category details retrieved");
  } catch (err) { return error(res, err.message); }
};
