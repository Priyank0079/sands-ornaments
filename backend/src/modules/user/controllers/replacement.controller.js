const Replacement = require("../../../models/Replacement");
const Order = require("../../../models/Order");
const { generateReplacementId } = require("../../../utils/generateId");
const { success, error } = require("../../../utils/apiResponse");

exports.requestReplacement = async (req, res) => {
  try {
    const { orderId, itemId, reason, description } = req.body;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return error(res, "Order not found", 404);

    const item = order.items.id(itemId);
    if (!item) return error(res, "Item not found in order", 404);

    const existing = await Replacement.findOne({ orderId, itemId });
    if (existing) return error(res, "Replacement already requested", 409);

    const images = req.files ? req.files.map(f => f.path) : [];

    const replacement = await Replacement.create({
      replacementId: generateReplacementId(),
      userId,
      orderId,
      itemId,
      reason,
      description,
      evidence: images,
      status: "Pending Approval",
      timeline: [{ status: "Requested", note: "Replacement request submitted" }]
    });

    return success(res, { replacement }, "Replacement requested successfully", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getMyReplacements = async (req, res) => {
  try {
    const replacements = await Replacement.find({ userId: req.user.userId }).populate("orderId", "orderId");
    return success(res, { replacements }, "Replacements retrieved");
  } catch (err) { return error(res, err.message); }
};
