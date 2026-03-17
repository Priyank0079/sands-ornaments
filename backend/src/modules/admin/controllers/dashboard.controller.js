const Order = require("../../../models/Order");
const User = require("../../../models/User");
const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

exports.getStats = async (req, res) => {
  try {
    // 1. Core Counts
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();

    // 2. Revenue Aggregation
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 3. Recent Sales (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const salesOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4. Order Status Distribution
    const statusDistribution = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 5. Category Distribution (Top 5 categories by revenue)
    const categoryStats = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $unwind: "$product.categories" }, // Product schema has [{ categoryId, ... }]
      {
        $group: {
          _id: "$product.categories.categoryId",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "catInfo" } },
      { $unwind: "$catInfo" },
      { $project: { name: "$catInfo.name", revenue: 1 } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    return success(res, {
      summary: { totalOrders, totalUsers, totalProducts, totalRevenue },
      salesOverTime,
      statusDistribution,
      categoryStats
    }, "Dashboard stats retrieved");

  } catch (err) { return error(res, err.message); }
};
