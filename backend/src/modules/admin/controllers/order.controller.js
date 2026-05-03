const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");
const mongoose = require("mongoose");

const ALLOWED_TRANSITIONS = {
  Pending: [],
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

exports.getOrderSummary = async (req, res) => {
  try {
    const [summary] = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0]
            }
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0]
            }
          },
          returned: {
            $sum: {
              $cond: [{ $eq: ["$status", "Returned"] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["Pending", "Processing", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Return Requested"]
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const data = summary || { total: 0, pending: 0, delivered: 0, cancelled: 0, returned: 0 };
    return success(res, { summary: data }, "Order summary retrieved");
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, userId } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
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
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit);

    const total = await Order.countDocuments(query);

    return success(res, { 
      orders, 
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.max(1, Math.ceil(total / parsedLimit))
      } 
    }, "Orders retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getOrderDetail = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return error(res, "Invalid order id", 400);
    }
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
    const { status, note, shippingInfo, itemVoidTags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(res, "Invalid order id", 400);
    }

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
    
    if (Array.isArray(itemVoidTags)) {
      itemVoidTags.forEach(({ itemId, voidTagId }) => {
        const item = order.items.id(itemId);
        if (item) {
          item.voidTagId = String(voidTagId || "").trim();
        }
      });
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
