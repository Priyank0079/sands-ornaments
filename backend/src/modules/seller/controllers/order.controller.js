const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");

exports.getMyOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    
    // Find orders containing this seller's products
    // Note: We return the whole order but the frontend should only show relevant items
    const orders = await Order.find({ "items.sellerId": sellerId }).sort({ createdAt: -1 });
    
    return success(res, { orders });
  } catch (err) { return error(res, err.message); }
};

exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status, note } = req.body;
    const sellerId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, "items._id": itemId, "items.sellerId": sellerId });
    if (!order) return error(res, "Order item not found", 404);

    const item = order.items.id(itemId);
    item.status = status; // Note: In schema, items have their own status? 
    // Yes, for marketplace isolation.

    order.timeline.push({
      status: `Item ${status}`,
      note: note || `Seller updated item status to ${status}`,
      date: new Date()
    });

    await order.save();
    return success(res, { order }, "Item status updated");
  } catch (err) { return error(res, err.message); }
};
