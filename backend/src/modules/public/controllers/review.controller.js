const Review = require("../../../models/Review");
const { success, error } = require("../../../utils/apiResponse");

exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const query = { isActive: true };
    if (productId) query.productId = productId;
    
    const reviews = await Review.find(query)
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    return success(res, { reviews });
  } catch (err) { return error(res, err.message); }
};

exports.createReview = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.userId };
    const review = await Review.create(data);
    return success(res, { review }, "Review submitted for approval", 201);
  } catch (err) { return error(res, err.message); }
};
