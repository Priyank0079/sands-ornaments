const Return = require("../../../models/Return");
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

exports.getAllReturns = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const returns = await Return.find(query)
      .populate("userId", "name phone")
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 });
    return success(res, { returns }, "Returns retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const { status, note, refundAmount } = req.body;
    const returnReq = await Return.findById(req.params.id).populate("orderId");
    if (!returnReq) return error(res, "Return request not found", 404);

    const VALID_STATUSES = ["Pending", "Approved", "Rejected", "Refunded", "Completed"];
    if (!VALID_STATUSES.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    returnReq.status = status;
    if (refundAmount) returnReq.refundAmount = refundAmount;
    returnReq.timeline.push({
      status,
      note: note || `Return status updated to ${status}`,
      date: new Date(),
    });
    await returnReq.save();

    // BUG-09 FIX: When return is approved/refunded, restock inventory and update order payment status
    if (status === "Approved" || status === "Refunded") {
      const order = returnReq.orderId; // populated above

      if (order) {
        // Restock each returned item
        for (const item of returnReq.items) {
          if (item.productId && item.variantId && item.quantity) {
            await Product.updateOne(
              { _id: item.productId, "variants._id": item.variantId },
              { $inc: { "variants.$.stock": item.quantity, "variants.$.sold": -item.quantity } }
            );
          }
        }

        // Mark order as refunded when status is Refunded
        if (status === "Refunded") {
          await Order.updateOne(
            { _id: order._id },
            { $set: { paymentStatus: "refunded" } }
          );
        }
      }
    }

    return success(res, { returnReq }, `Return ${status} successfully`);
  } catch (err) { return error(res, err.message); }
};
