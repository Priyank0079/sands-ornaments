const Banner = require("../../../models/Banner");
const Blog = require("../../../models/Blog");
const FAQ = require("../../../models/FAQ");
const slugify = require("../../../utils/slugify");
const { success, error } = require("../../../utils/apiResponse");

// ── Banners ──────────────────────────────────────────────────────────────────
exports.createBanner = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.path;
    const banner = await Banner.create(data);
    return success(res, { banner }, "Banner created", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1 });
    return success(res, { banners });
  } catch (err) { return error(res, err.message); }
};

exports.getBannerDetail = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return error(res, "Banner not found", 404);
    return success(res, { banner });
  } catch (err) { return error(res, err.message); }
};

exports.updateBanner = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.path;
    const banner = await Banner.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!banner) return error(res, "Banner not found", 404);
    return success(res, { banner }, "Banner updated");
  } catch (err) { return error(res, err.message); }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return success(res, {}, "Banner deleted");
  } catch (err) { return error(res, err.message); }
};

// ── Blogs (Admin CRUD) ──────────────────────────────────────────────────────
exports.createBlog = async (req, res) => {
  try {
    const data = req.body;
    data.slug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (req.file) data.image = req.file.path;
    data.author = req.user.name || "Admin";

    const blog = await Blog.create(data);
    return success(res, { blog }, "Blog published", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return success(res, { blogs });
  } catch (err) { return error(res, err.message); }
};

exports.getBlogDetail = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return error(res, "Blog not found", 404);
    return success(res, { blog });
  } catch (err) { return error(res, err.message); }
};

exports.updateBlog = async (req, res) => {
  try {
    const data = req.body;
    if (data.title && !data.slug) data.slug = slugify(data.title);
    else if (data.slug) data.slug = slugify(data.slug);
    
    if (req.file) data.image = req.file.path;
    const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!blog) return error(res, "Blog not found", 404);
    return success(res, { blog }, "Blog updated");
  } catch (err) { return error(res, err.message); }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    return success(res, {}, "Blog deleted");
  } catch (err) { return error(res, err.message); }
};

// ── FAQs ─────────────────────────────────────────────────────────────────────
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    return success(res, { faq }, "FAQ created", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ category: 1, sortOrder: 1 });
    return success(res, { faqs });
  } catch (err) { return error(res, err.message); }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return error(res, "FAQ not found", 404);
    return success(res, { faq }, "FAQ updated");
  } catch (err) { return error(res, err.message); }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    return success(res, {}, "FAQ deleted");
  } catch (err) { return error(res, err.message); }
};
