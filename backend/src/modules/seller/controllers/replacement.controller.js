const Replacement = require("../../../models/Replacement");
const Product = require("../../../models/Product");
const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");

const SELLER_ACTIONABLE_STATUSES = ["Pending"];
const SELLER_ALLOWED_STATUSES = ["Approved", "Rejected"];

const buildSellerReplacementScope = async (sellerId) => {
  const products = await Product.find({ sellerId }).select("_id");
  return products.map((product) => product._id);
};

exports.getReplacements = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerProductIds = await buildSellerReplacementScope(sellerId);
    const replacements = sellerProductIds.length
      ? await Replacement.find({ "originalItems.productId": { $in: sellerProductIds } })
          .populate("userId", "name email phone")
          .populate("orderId", "orderId total paymentStatus")
          .sort({ createdAt: -1 })
      : [];

    return success(res, { replacements });
  } catch (err) { return error(res, err.message); }
};

exports.getReplacementDetail = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerProductIds = await buildSellerReplacementScope(sellerId);
    const replacementReq = sellerProductIds.length
      ? await Replacement.findOne({ _id: req.params.id, "originalItems.productId": { $in: sellerProductIds } })
          .populate("userId", "name email phone")
          .populate("orderId", "orderId total paymentStatus shippingAddress")
      : null;

    if (!replacementReq) return error(res, "Replacement request not found", 404);
    return success(res, { replacementReq });
  } catch (err) { return error(res, err.message); }
};

exports.processReplacement = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { status, remarks } = req.body;
    const sellerProductIds = await buildSellerReplacementScope(sellerId);

    if (!SELLER_ALLOWED_STATUSES.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${SELLER_ALLOWED_STATUSES.join(", ")}`, 400);
    }

    const replacementReq = sellerProductIds.length
      ? await Replacement.findOne({ _id: req.params.id, "originalItems.productId": { $in: sellerProductIds } })
      : null;
    if (!replacementReq) return error(res, "Replacement request not found", 404);

    if (!SELLER_ACTIONABLE_STATUSES.includes(replacementReq.status)) {
      return error(res, `Seller can only process replacements in: ${SELLER_ACTIONABLE_STATUSES.join(", ")}`, 400);
    }

    replacementReq.status = status;
    if (remarks) {
      replacementReq.adminComment = remarks;
    }
    replacementReq.timeline = Array.isArray(replacementReq.timeline) ? replacementReq.timeline : [];
    replacementReq.timeline.push({
      status,
      note: remarks || `Seller marked replacement as ${status}`,
      date: new Date()
    });
    await replacementReq.save();

    if (replacementReq.orderId) {
      const nextOrderStatus = status === "Rejected" ? "Delivered" : "Return Requested";
      await Order.updateOne(
        { _id: replacementReq.orderId },
        {
          $set: { status: nextOrderStatus },
          $push: {
            timeline: {
              status: nextOrderStatus,
              note: remarks || `Seller marked replacement as ${status}`,
              date: new Date()
            }
          }
        }
      );
    }

    const refreshed = await Replacement.findById(replacementReq._id)
      .populate("userId", "name email phone")
      .populate("orderId", "orderId total paymentStatus shippingAddress");

    return success(res, { replacementReq: refreshed }, "Replacement request processed successfully");
  } catch (err) { return error(res, err.message); }
};
