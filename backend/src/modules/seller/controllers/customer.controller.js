const mongoose = require("mongoose");
const Order = require("../../../models/Order");
const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

exports.getMyCustomers = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerObjectId = mongoose.Types.ObjectId.isValid(sellerId)
      ? new mongoose.Types.ObjectId(sellerId)
      : sellerId;
    
    const customers = await Order.aggregate([
      { $match: { "items.sellerId": sellerObjectId } },
      { $sort: { createdAt: -1 } },
      { $project: { userId: 1, customerName: 1, shippingAddress: 1 } },
      { $group: { _id: "$userId", latest: { $first: "$$ROOT" } } },
      { $project: { _id: 1, customerName: "$latest.customerName", shippingAddress: "$latest.shippingAddress" } }
    ]);

    const normalized = customers.map((customer) => {
      const shipping = customer.shippingAddress || {};
      const nameParts = [shipping.firstName, shipping.lastName].filter(Boolean);
      const name = nameParts.join(" ").trim() || customer.customerName || "Customer";

      return {
        id: customer._id,
        name
      };
    });

    return success(res, { customers: normalized });
  } catch (err) { return error(res, err.message); }
};

exports.getMyCustomerDetails = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { id: customerId } = req.params;
    const sellerObjectId = mongoose.Types.ObjectId.isValid(sellerId)
      ? new mongoose.Types.ObjectId(sellerId)
      : sellerId;

    const orders = await Order.find({
      userId: customerId,
      "items.sellerId": sellerObjectId
    }).sort({ createdAt: -1 });

    if (!orders.length) {
      return success(res, { customer: null, orders: [] });
    }

    const latestOrder = orders[0];
    const shipping = latestOrder.shippingAddress || {};
    const nameParts = [shipping.firstName, shipping.lastName].filter(Boolean);
    const fallbackName = nameParts.join(" ").trim() || latestOrder.customerName || "Customer";
    const user = mongoose.Types.ObjectId.isValid(customerId)
      ? await User.findById(customerId).select("name email")
      : null;

    const name = user?.name || fallbackName;
    const email = user?.email || latestOrder.customerEmail || shipping.email || "";

    let totalOrders = 0;
    let totalSpend = 0;
    const normalizedOrders = orders.map((order) => {
      const sellerItems = (order.items || []).filter((item) => (
        String(item.sellerId) === String(sellerObjectId)
      ));
      if (!sellerItems.length) return null;
      totalOrders += 1;
      const amount = sellerItems.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
      }, 0);
      totalSpend += amount;
      const itemsSummary = sellerItems.map((item) => item.name).filter(Boolean).join(", ");

      return {
        id: order.orderId || order._id,
        date: order.createdAt,
        items: itemsSummary || "Items",
        amount,
        status: String(order.status || "Processing").toUpperCase()
      };
    }).filter(Boolean);

    const averageOrder = totalOrders ? Math.round(totalSpend / totalOrders) : 0;

    return success(res, {
      customer: {
        id: customerId,
        name,
        email,
        totalOrders,
        totalSpend,
        averageOrder
      },
      orders: normalizedOrders
    });
  } catch (err) { return error(res, err.message); }
};
