const Return = require("../../../models/Return");
const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

const SELLER_ACTIONABLE_STATUSES = ["Pending"];
const SELLER_ALLOWED_STATUSES = ["Approved", "Rejected"];

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
          .populate("userId", "name email phone")
          .populate("orderId", "orderId total paymentStatus")
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
          .populate("userId", "name email phone")
          .populate("orderId", "orderId total paymentStatus shippingAddress")
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

    if (!SELLER_ALLOWED_STATUSES.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${SELLER_ALLOWED_STATUSES.join(", ")}`, 400);
    }

    const returnReq = sellerProductIds.length
      ? await Return.findOne({ _id: req.params.id, "items.productId": { $in: sellerProductIds } })
      : null;
    if (!returnReq) return error(res, "Return request not found", 404);

    if (!SELLER_ACTIONABLE_STATUSES.includes(returnReq.status)) {
      return error(res, `Seller can only process returns in: ${SELLER_ACTIONABLE_STATUSES.join(", ")}`, 400);
    }

    returnReq.status = status;
    if (remarks) {
      returnReq.adminComment = remarks;
    }
    returnReq.timeline.push({
      status,
      note: remarks || `Seller marked return as ${status}`
    });
    returnReq.logs = Array.isArray(returnReq.logs) ? returnReq.logs : [];
    returnReq.logs.push({
      action: "SELLER_STATUS_UPDATE",
      comment: remarks || `Seller marked return as ${status}`,
      by: "seller",
      date: new Date()
    });
    await returnReq.save();

    const refreshed = await Return.findById(returnReq._id)
      .populate("userId", "name email phone")
      .populate("orderId", "orderId total paymentStatus shippingAddress");

    return success(res, { returnReq: refreshed }, "Return request processed successfully");
  } catch (err) { return error(res, err.message); }
};
