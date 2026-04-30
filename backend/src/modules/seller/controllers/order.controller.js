const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");
const mongoose = require("mongoose");

const normalizeOrderStatus = (value = "") => String(value || "").trim();

const allowedTransitions = {
  Pending: [],
  Processing: ["Confirmed", "Cancelled"],
  Confirmed: ["Packed"],
  Packed: ["Shipped"],
  Shipped: ["Delivered"],
};

const filterSellerItems = (items = [], sellerId) =>
  (items || []).filter((item) => String(item?.sellerId || "") === String(sellerId));

const getPrimaryItemImage = (item = {}) =>
  item.image ||
  item.productId?.images?.[0] ||
  item.productId?.image ||
  "";

const buildSellerOrderSummary = (order, sellerId) => {
  const sellerItems = filterSellerItems(order.items, sellerId);
  const sellerSubtotal = sellerItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const allItemsOwnedBySeller = sellerItems.length > 0 && sellerItems.length === (order.items || []).length;

  const user = order.userId || {};
  const address = order.shippingAddress || {};
  const fallbackCustomerName =
    order.customerName ||
    user.fullName ||
    user.name ||
    [address.firstName, address.lastName].filter(Boolean).join(" ") ||
    "Customer";
  const fallbackCustomerEmail = order.customerEmail || user.email || address.email || "";
  const fallbackCustomerPhone = order.customerPhone || user.mobileNumber || address.phone || "";

  return {
    _id: order._id,
    orderId: order.orderId,
    customerName: fallbackCustomerName,
    customerEmail: fallbackCustomerEmail,
    customerPhone: fallbackCustomerPhone,
    userId: order.userId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    shippingAddress: order.shippingAddress,
    shippingInfo: order.shippingInfo,
    timeline: order.timeline,
    sellerItems,
    sellerItemCount: sellerItems.length,
    sellerSubtotal,
    allItemsOwnedBySeller,
    canManageStatus: allItemsOwnedBySeller,
    allowedNextStatuses: allItemsOwnedBySeller ? (allowedTransitions[order.status] || []) : [],
  };
};

exports.getMyOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const { status, paymentStatus, search } = req.query;

    const query = { "items.sellerId": sellerId };
    if (status) {
      query.status = String(status);
    }
    if (paymentStatus) {
      query.paymentStatus = String(paymentStatus);
    }
    if (search) {
      const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { orderId: { $regex: escaped, $options: "i" } },
        { customerName: { $regex: escaped, $options: "i" } },
        { customerEmail: { $regex: escaped, $options: "i" } },
        { customerPhone: { $regex: escaped, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("userId", "fullName email mobileNumber")
        .populate("items.productId", "name images image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    const sellerOrders = orders
      .map((order) => buildSellerOrderSummary(order, sellerId))
      .filter((order) => order.sellerItemCount > 0);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return success(res, {
      orders: sellerOrders,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages
      }
    }, "Seller orders retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getMyOrderDetail = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return error(res, "Invalid order id", 400);
    }
    const order = await Order.findOne({ _id: req.params.id, "items.sellerId": sellerId })
      .populate("userId", "fullName email mobileNumber")
      .populate("items.productId", "name images image");

    if (!order) return error(res, "Order not found", 404);

    const sellerOrder = buildSellerOrderSummary(order, sellerId);
    return success(res, { order: sellerOrder }, "Seller order retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note, shippingInfo, itemVoidTags } = req.body;
    const sellerId = req.user.userId;
    const nextStatus = normalizeOrderStatus(status);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return error(res, "Invalid order id", 400);
    }

    if (!nextStatus) return error(res, "Status is required", 400);

    const order = await Order.findOne({ _id: orderId, "items.sellerId": sellerId })
      .populate("userId", "fullName email mobileNumber")
      .populate("items.productId", "name images image");

    if (!order) return error(res, "Order not found", 404);

    const sellerItems = filterSellerItems(order.items, sellerId);
    if (sellerItems.length !== (order.items || []).length) {
      return error(res, "This order contains items from multiple owners and must be managed by admin", 400);
    }

    const normalizedShippingInfo = shippingInfo && typeof shippingInfo === "object"
      ? {
          carrier: String(shippingInfo.carrier || "").trim(),
          trackingId: String(shippingInfo.trackingId || "").trim(),
          trackingUrl: String(shippingInfo.trackingUrl || "").trim(),
          estimatedDelivery: shippingInfo.estimatedDelivery || undefined
        }
      : null;

    const allowedStatuses = allowedTransitions[order.status] || [];
    const isSameStatusUpdate = nextStatus === order.status;
    if (!isSameStatusUpdate && !allowedStatuses.includes(nextStatus)) {
      return error(res, `Seller cannot move order from ${order.status} to ${nextStatus}`, 400);
    }

    if (Array.isArray(itemVoidTags)) {
      itemVoidTags.forEach(({ itemId, voidTagId }) => {
        const item = order.items.id(itemId);
        if (item) {
          item.voidTagId = String(voidTagId || "").trim();
        }
      });
    }

    if (["Shipped", "Delivered"].includes(nextStatus)) {
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

    if (nextStatus === "Shipped") {
      order.shippingInfo = {
        ...order.shippingInfo,
        carrier: order.shippingInfo?.carrier || "Manual Dispatch",
      };
    }

    order.timeline.push({
      status: isSameStatusUpdate ? order.status : nextStatus,
      note: note || (isSameStatusUpdate ? "Seller updated shipping info" : `Seller updated order status to ${nextStatus}`),
      date: new Date()
    });

    await order.save();

    const refreshed = await Order.findById(order._id)
      .populate("userId", "fullName email mobileNumber")
      .populate("items.productId", "name images image");

    return success(
      res,
      { order: buildSellerOrderSummary(refreshed, sellerId) },
      `Order status updated to ${nextStatus}`
    );
  } catch (err) { return error(res, err.message); }
};

exports.getOrderCardData = { buildSellerOrderSummary, getPrimaryItemImage };
