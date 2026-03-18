const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, userId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return success(res, { 
      orders, 
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } 
    }, "Orders retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId", "name images variants");
    if (!order) return error(res, "Order not found", 404);
    return success(res, { order }, "Order details retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, shippingInfo } = req.body;

    const order = await Order.findById(id);
    if (!order) return error(res, "Order not found", 404);

    order.status = status;
    if (shippingInfo) order.shippingInfo = { ...order.shippingInfo, ...shippingInfo };
    
    order.timeline.push({
      status,
      note: note || `Order status updated to ${status}`,
      date: new Date()
    });

    await order.save();
    return success(res, { order }, `Order status updated to ${status}`);
  } catch (err) { return error(res, err.message); }
};
