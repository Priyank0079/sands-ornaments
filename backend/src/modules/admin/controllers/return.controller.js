const Return = require("../../../models/Return");
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const StockLog = require("../../../models/StockLog");
const { success, error } = require("../../../utils/apiResponse");
const { isSerializedVariant, restockSerializedUnits } = require("../../../utils/inventorySync");

const VALID_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Pickup Scheduled",
  "Pickup Completed",
  "Refund Initiated",
  "Refunded",
  "Closed"
];

const ALLOWED_TRANSITIONS = {
  Pending: ["Approved", "Rejected"],
  Approved: ["Pickup Scheduled", "Refund Initiated", "Refunded", "Closed"],
  Rejected: [],
  "Pickup Scheduled": ["Pickup Completed"],
  "Pickup Completed": ["Refund Initiated", "Refunded", "Closed"],
  "Refund Initiated": ["Refunded", "Closed"],
  Refunded: ["Closed"],
  Closed: []
};

const STATUSES_THAT_KEEP_ORDER_IN_RETURN_FLOW = [
  "Pending",
  "Approved",
  "Pickup Scheduled",
  "Pickup Completed",
  "Refund Initiated"
];

const shouldMarkOrderAsReturned = (currentStatus, nextStatus) => {
  if (nextStatus === "Refunded") return true;
  if (nextStatus !== "Closed") return false;

  return ["Approved", "Pickup Scheduled", "Pickup Completed", "Refund Initiated", "Refunded", "Closed"].includes(currentStatus);
};

const buildOrderStatusFromReturnStatus = (currentStatus, nextStatus) => {
  if (STATUSES_THAT_KEEP_ORDER_IN_RETURN_FLOW.includes(nextStatus)) {
    return "Return Requested";
  }

  if (nextStatus === "Rejected") {
    return "Delivered";
  }

  if (shouldMarkOrderAsReturned(currentStatus, nextStatus)) {
    return "Returned";
  }

  return null;
};

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

exports.getReturnDetail = async (req, res) => {
  try {
    const returnReq = await Return.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("orderId", "orderId paymentStatus total shippingAddress");
    if (!returnReq) return error(res, "Return request not found", 404);
    return success(res, { returnReq }, "Return detail retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const {
      status,
      note,
      refundAmount,
      refundMethod,
      refundTransactionId,
      pickupPartner,
      pickupAwb,
      pickupScheduledDate
    } = req.body;
    const returnReq = await Return.findById(req.params.id)
      .populate("orderId", "orderId paymentStatus total shippingAddress");
    if (!returnReq) return error(res, "Return request not found", 404);
    if (!VALID_STATUSES.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    const currentStatus = String(returnReq.status || "").trim();
    const nextStatus = String(status || "").trim();
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (currentStatus !== nextStatus && !allowed.includes(nextStatus)) {
      return error(res, `Invalid status transition from ${currentStatus} to ${nextStatus}`, 400);
    }

    returnReq.status = nextStatus;
    if (typeof note === "string" && note.trim()) {
      returnReq.adminComment = note.trim();
    }
    if (refundAmount !== undefined && refundAmount !== null && refundAmount !== "") {
      returnReq.refund = {
        ...(returnReq.refund || {}),
        amount: Number(refundAmount) || 0,
        initiatedAt: ["Refund Initiated", "Refunded"].includes(nextStatus)
          ? (returnReq.refund?.initiatedAt || new Date())
          : returnReq.refund?.initiatedAt
      };
    }
    if (typeof refundMethod === "string" && refundMethod.trim()) {
      returnReq.refund = {
        ...(returnReq.refund || {}),
        method: refundMethod.trim()
      };
    }
    if (typeof refundTransactionId === "string" && refundTransactionId.trim()) {
      returnReq.refund = {
        ...(returnReq.refund || {}),
        transactionId: refundTransactionId.trim()
      };
    }
    if (nextStatus === "Pickup Scheduled" || nextStatus === "Pickup Completed") {
      returnReq.pickup = {
        ...(returnReq.pickup || {}),
        partner: typeof pickupPartner === "string" && pickupPartner.trim() ? pickupPartner.trim() : returnReq.pickup?.partner,
        awb: typeof pickupAwb === "string" && pickupAwb.trim() ? pickupAwb.trim() : returnReq.pickup?.awb,
        scheduledDate: pickupScheduledDate || returnReq.pickup?.scheduledDate || new Date(),
        status: nextStatus === "Pickup Completed" ? "Completed" : "Scheduled"
      };
    }
    returnReq.timeline.push({
      status: nextStatus,
      note: note || `Return status updated to ${nextStatus}`,
      date: new Date(),
    });
    returnReq.logs.push({
      action: "STATUS_UPDATE",
      comment: note || `Return status updated to ${nextStatus}`,
      by: "admin",
      date: new Date()
    });
    await returnReq.save();

    const order = returnReq.orderId;

    const needsRestock = nextStatus === "Refunded" && !returnReq.inventory?.restockedAt;
    if (needsRestock) {
      // Restock each returned item only once when the refund is actually completed
      if (order) {
        for (const item of returnReq.items) {
          const quantity = Number(item.qty ?? item.quantity ?? 0);
          if (item.productId && item.variantId && quantity > 0) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const variant = product.variants.id(item.variantId);
            if (!variant) continue;

            const previousStock = Number(variant.stock) || 0;
            const variantIndex = product.variants.findIndex(v => String(v._id) === String(item.variantId));

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
              reason: `Return ${nextStatus} for order ${order.orderId || order._id}`,
              adminId: req.user.userId
            });
          }
        }

        returnReq.inventory = {
          ...(returnReq.inventory || {}),
          restockedAt: new Date(),
          restockedByStatus: nextStatus
        };
        await returnReq.save();
      }
    }

    if (order) {
      const nextOrderStatus = buildOrderStatusFromReturnStatus(currentStatus, nextStatus);
      const orderUpdate = {};

      if (nextStatus === "Refunded") {
        orderUpdate.paymentStatus = "refunded";
      }
      if (nextOrderStatus) {
        orderUpdate.status = nextOrderStatus;
      }

      if (Object.keys(orderUpdate).length > 0) {
        await Order.updateOne(
          { _id: order._id },
          {
            $set: orderUpdate,
            $push: {
              timeline: {
                status: orderUpdate.status || order.status,
                note: note || `Return updated to ${nextStatus}`,
                date: new Date()
              }
            }
          }
        );
      }
    }

    const refreshed = await Return.findById(returnReq._id)
      .populate("userId", "name email phone")
      .populate("orderId", "orderId paymentStatus total shippingAddress");

    return success(res, { returnReq: refreshed }, `Return ${nextStatus} successfully`);
  } catch (err) { return error(res, err.message); }
};
