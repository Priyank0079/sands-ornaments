const Page = require("../../../models/Page");
const { success, error } = require("../../../utils/apiResponse");
const { sanitizePageHtml } = require("../../../utils/pageSanitizer");

exports.getPageBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    const page = await Page.findOne({ slug }).lean();
    const safePage = page
      ? {
          ...page,
          content: sanitizePageHtml(page.content || "")
        }
      : null;

    // Return null instead of 404 to keep frontend fallback behavior stable.
    return success(res, { page: safePage }, "Page retrieval status");
  } catch (err) {
    return error(res, err.message);
  }
};
