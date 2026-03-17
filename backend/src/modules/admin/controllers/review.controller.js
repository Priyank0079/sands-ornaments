const Review = require("../../../models/Review");
const { success, error } = require("../../../utils/apiResponse");

exports.getReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const reviews = await Review.find(query)
      .populate("userId", "name")
      .populate("productId", "name")
      .sort({ createdAt: -1 });
    return success(res, { reviews });
  } catch (err) { return error(res, err.message); }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return error(res, "Review not found", 404);
    return success(res, {}, "Review deleted successfully");
  } catch (err) { return error(res, err.message); }
};

exports.toggleReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, "Review not found", 404);
    review.active = !review.active;
    await review.save();
    return success(res, { review }, `Review ${review.active ? "enabled" : "disabled"}`);
  } catch (err) { return error(res, err.message); }
};
