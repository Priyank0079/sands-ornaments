const Return = require("../../../models/Return");
const Replacement = require("../../../models/Replacement");
const Order = require("../../../models/Order");
const { generateReturnId } = require("../../../utils/generateId");
const { success, error } = require("../../../utils/apiResponse");
const { createSellerNotification } = require("../../../services/sellerNotificationService");

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

    // Check if already requested for return flow
    const existing = await Return.findOne({ orderId, "items.variantId": item.variantId });
    if (existing) return error(res, "Return already requested for this item", 409);

    // Prevent parallel replacement + return for the same variant
    const replacementExists = await Replacement.findOne({ orderId, "originalItems.variantId": item.variantId });
    if (replacementExists) {
      return error(res, "Replacement already requested for this item. Please complete that flow first.", 409);
    }

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

    order.status = "Return Requested";
    order.timeline = Array.isArray(order.timeline) ? order.timeline : [];
    order.timeline.push({
      status: "Return Requested",
      note: `Return requested for ${item.name || "order item"}`,
      date: new Date()
    });
    await order.save();

    // Notify seller (if this item belongs to a seller listing).
    if (item?.sellerId) {
      await createSellerNotification({
        sellerId: item.sellerId,
        title: "Return requested",
        message: `Return requested for order ${order.orderId || order._id}. Item: ${item.name || "Order item"}.`,
        type: "RETURN",
        priority: "High",
        link: `/seller/return-details/${returnRequest._id}`
      });
    }

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
