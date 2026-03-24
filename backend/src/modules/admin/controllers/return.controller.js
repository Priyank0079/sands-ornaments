const Return = require("../../../models/Return");
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const { success, error } = require("../../../utils/apiResponse");
const { isSerializedVariant, restockSerializedUnits } = require("../../../utils/inventorySync");

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
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const variant = product.variants.id(item.variantId);
            if (!variant) continue;

            const previousStock = Number(variant.stock) || 0;
            const quantity = Number(item.quantity) || 0;
            const variantIndex = product.variants.findIndex(v => String(v._id) === String(item.variantId));

            if (quantity <= 0) continue;

            if (isSerializedVariant(product, variant)) {
              restockSerializedUnits({
                product,
                variant,
                quantity,
                variantIndex
              });
            } else {
              variant.stock = previousStock + quantity;
            }

            variant.sold = Math.max(0, (Number(variant.sold) || 0) - quantity);
            await product.save();

            await StockLog.create({
              productId: product._id,
              variantId: variant._id,
              changeType: "return",
              previousStock,
              newStock: variant.stock,
              change: variant.stock - previousStock,
              reason: `Return ${status} for order ${order.orderId || order._id}`,
              adminId: req.user.userId
            });
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
