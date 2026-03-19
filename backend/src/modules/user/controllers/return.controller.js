const Return = require("../../../models/Return");
const Order = require("../../../models/Order");
const { generateReturnId } = require("../../../utils/generateId");
const { success, error } = require("../../../utils/apiResponse");

exports.requestReturn = async (req, res) => {
  try {
    const { orderId, itemId, reason, description } = req.body;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return error(res, "Order not found", 404);

    if (order.status !== "Delivered") {
      return error(res, "Returns can only be requested for delivered orders", 400);
    }

    const item = order.items.id(itemId);
    if (!item) return error(res, "Item not found in order", 404);

    // Check if already requested
    const existing = await Return.findOne({ orderId, "items.variantId": item.variantId });
    if (existing) return error(res, "Return already requested for this item", 409);

    const images = req.files ? req.files.map(f => f.path) : [];

    const returnRequest = await Return.create({
      returnId: generateReturnId(),
      userId,
      orderId,
      items: [{
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: item.sku,
        qty: item.quantity,
        price: item.price,
        reason
      }],
      evidence: { reason, comment: description, images },
      status: "Pending",
      timeline: [{ status: "Requested", note: "Return request submitted" }]
    });

    return success(res, { returnRequest }, "Return requested successfully", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getMyReturns = async (req, res) => {
  try {
    const returns = await Return.find({ userId: req.user.userId })
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 });
    return success(res, { returns }, "Returns retrieved");
  } catch (err) { return error(res, err.message); }
};
