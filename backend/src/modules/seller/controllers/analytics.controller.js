const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

exports.getSalesTrend = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trend = await Order.aggregate([
      { $match: { "items.sellerId": sellerId, paymentStatus: "paid", createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      { $match: { "items.sellerId": sellerId } },
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
    const performance = await Order.aggregate([
      { $match: { "items.sellerId": sellerId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $match: { "items.sellerId": sellerId } },
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
