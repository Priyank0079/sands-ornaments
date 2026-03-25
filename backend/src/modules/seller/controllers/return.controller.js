const Return = require("../../../models/Return");
const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

const buildSellerReturnScope = async (sellerId) => {
  const products = await Product.find({ sellerId }).select("_id");
  return products.map((product) => product._id);
};

exports.getReturns = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerProductIds = await buildSellerReturnScope(sellerId);
    const returns = sellerProductIds.length
      ? await Return.find({ "items.productId": { $in: sellerProductIds } })
          .populate("userId", "name email")
          .populate("orderId", "orderId")
          .sort({ createdAt: -1 })
      : [];
    return success(res, { returns });
  } catch (err) { return error(res, err.message); }
};

exports.getReturnDetail = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerProductIds = await buildSellerReturnScope(sellerId);
    const returnReq = sellerProductIds.length
      ? await Return.findOne({ _id: req.params.id, "items.productId": { $in: sellerProductIds } })
          .populate("userId", "name email")
          .populate("orderId")
      : null;
    if (!returnReq) return error(res, "Return request not found", 404);
    return success(res, { returnReq });
  } catch (err) { return error(res, err.message); }
};

exports.processReturn = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { status, remarks } = req.body;
    const sellerProductIds = await buildSellerReturnScope(sellerId);
    const validStatuses = ["Approved", "Rejected"];

    if (!validStatuses.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
    }

    const returnReq = sellerProductIds.length
      ? await Return.findOne({ _id: req.params.id, "items.productId": { $in: sellerProductIds } })
      : null;
    if (!returnReq) return error(res, "Return request not found", 404);

    returnReq.status = status;
    if (remarks) {
      returnReq.adminComment = remarks;
    }
    returnReq.timeline.push({
      status,
      note: remarks || `Seller marked return as ${status}`
    });
    await returnReq.save();
    return success(res, { returnReq }, "Return request processed successfully");
  } catch (err) { return error(res, err.message); }
};
