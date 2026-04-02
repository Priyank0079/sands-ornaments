const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");

const ALLOWED_TRANSITIONS = {
  Processing: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed", "Cancelled"],
  Packed: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Delivered"],
  "Out for Delivery": ["Delivered"],
  Delivered: [],
  Cancelled: [],
  "Return Requested": ["Returned"],
  Returned: []
};

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
      .populate("userId", "name email phone")
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
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name images variants");
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

    const nextStatus = String(status || "").trim();
    const currentStatus = String(order.status || "").trim();
    const normalizedShippingInfo = shippingInfo && typeof shippingInfo === "object"
      ? {
          carrier: String(shippingInfo.carrier || "").trim(),
          trackingId: String(shippingInfo.trackingId || "").trim(),
          trackingUrl: String(shippingInfo.trackingUrl || "").trim(),
          estimatedDelivery: shippingInfo.estimatedDelivery || undefined
        }
      : null;

    if (!nextStatus) {
      return error(res, "Status is required", 400);
    }

    const isSameStatusUpdate = nextStatus === currentStatus;
    if (!isSameStatusUpdate) {
      const allowedStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
      if (!allowedStatuses.includes(nextStatus)) {
        return error(res, `Invalid status transition from ${currentStatus} to ${nextStatus}`, 400);
      }
    }

    if (["Shipped", "Out for Delivery"].includes(nextStatus)) {
      const mergedShippingInfo = {
        ...(order.shippingInfo || {}),
        ...(normalizedShippingInfo || {})
      };
      if (!String(mergedShippingInfo.carrier || "").trim()) {
        return error(res, "Carrier is required before marking this order for shipment", 400);
      }
      order.shippingInfo = mergedShippingInfo;
    } else if (normalizedShippingInfo) {
      order.shippingInfo = {
        ...(order.shippingInfo || {}),
        ...normalizedShippingInfo
      };
    }

    if (!isSameStatusUpdate) {
      order.status = nextStatus;
    }
    
    order.timeline.push({
      status: isSameStatusUpdate ? currentStatus : nextStatus,
      note: note || (isSameStatusUpdate ? "Order shipping info updated" : `Order status updated to ${nextStatus}`),
      date: new Date()
    });

    await order.save();
    const refreshed = await Order.findById(order._id)
      .populate("userId", "name email phone")
      .populate("items.productId", "name images variants");

    return success(
      res,
      { order: refreshed },
      isSameStatusUpdate ? "Order shipping info updated" : `Order status updated to ${nextStatus}`
    );
  } catch (err) { return error(res, err.message); }
};
