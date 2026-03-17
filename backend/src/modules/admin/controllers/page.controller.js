const Page = require("../../../models/Page");
const { success, error } = require("../../../utils/apiResponse");

// Public: Get page content by slug
exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug });
    // Return null page instead of 404 to avoid console errors when page doesn't exist yet
    return success(res, { page: page || null }, "Page retrieval status");
  } catch (err) {
    return error(res, err.message);
  }
};

// Admin: Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ title: 1 });
    return success(res, { pages }, "Pages retrieved successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

// Admin: Upsert page (Create or Update)
exports.upsertPage = async (req, res) => {
  try {
    const { slug, title, content } = req.body;
    
    if (!slug) return error(res, "Slug is required", 400);

    const page = await Page.findOneAndUpdate(
      { slug },
      { 
        title, 
        content, 
        updatedBy: req.user?._id,
        lastUpdated: Date.now()
      },
      { new: true, upsert: true, runValidators: true }
    );

    return success(res, { page }, "Page saved successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

// Admin: Delete page
exports.deletePage = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOneAndDelete({ slug });
    if (!page) return error(res, "Page not found", 404);
    
    return success(res, {}, "Page deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
