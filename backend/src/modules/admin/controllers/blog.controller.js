const Blog = require("../../../models/Blog");
const slugify = require("../../../utils/slugify");
const { success, error } = require("../../../utils/apiResponse");

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return success(res, { blogs }, "Blogs retrieved successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return error(res, "Blog not found", 404);
    return success(res, { blog }, "Blog retrieved successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, category, excerpt, author, tags, isPublished } = req.body;
    
    const blogSlug = slug ? slugify(slug) : slugify(title);
    
    // Check for duplicate slug
    const existing = await Blog.findOne({ slug: blogSlug });
    if (existing) return error(res, "A blog with this title/slug already exists", 409);

    const blog = await Blog.create({
      title,
      slug: blogSlug,
      content,
      category,
      excerpt,
      coverImage: req.file ? req.file.path : null,
      author: author || "SANDS Admin",
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      isPublished: isPublished !== undefined ? isPublished : true,
      publishedAt: isPublished !== false ? new Date() : null
    });

    return success(res, { blog }, "Blog created successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, category, excerpt, author, tags, isPublished } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return error(res, "Blog not found", 404);

    if (title) {
        blog.title = title;
        if (!slug) blog.slug = slugify(title);
    }
    if (slug) blog.slug = slugify(slug);
    
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (author !== undefined) blog.author = author;
    if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    
    if (isPublished !== undefined) {
        if (isPublished && !blog.isPublished) blog.publishedAt = new Date();
        blog.isPublished = isPublished;
    }

    if (req.file) {
      blog.coverImage = req.file.path;
    } else if (req.body.removeImage === 'true') {
      blog.coverImage = null;
    }

    await blog.save();
    return success(res, { blog }, "Blog updated successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return error(res, "Blog not found", 404);
    
    return success(res, {}, "Blog deleted successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
