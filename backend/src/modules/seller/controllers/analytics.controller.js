const Order = require("../../../models/Order");
const mongoose = require("mongoose");
const { success, error } = require("../../../utils/apiResponse");

exports.getSalesTrend = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(String(sellerId || ""))) {
      return error(res, "Invalid seller id", 400);
    }
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const rawDays = Number.parseInt(req.query.days, 10);
    const days = Number.isFinite(rawDays) ? Math.min(Math.max(rawDays, 1), 365) : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trend = await Order.aggregate([
      { $match: { "items.sellerId": sellerObjectId, paymentStatus: "paid", createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      { $match: { "items.sellerId": sellerObjectId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          salesCount: { $sum: "$items.quantity" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return success(res, { trend });
  } catch (err) { return error(res, err.message); }
};

exports.getProductPerformance = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(String(sellerId || ""))) {
      return error(res, "Invalid seller id", 400);
    }
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const performance = await Order.aggregate([
      { $match: { "items.sellerId": sellerObjectId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $match: { "items.sellerId": sellerObjectId } },
      {
        $group: {
          _id: "$items.productId",
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { name: "$product.name", totalRevenue: 1, totalSold: 1 } },
      { $sort: { totalSold: -1 } }
    ]);

    return success(res, { performance });
  } catch (err) { return error(res, err.message); }
};
