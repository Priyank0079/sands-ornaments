const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const { success, error } = require("../../../utils/apiResponse");

exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const totalProducts = await Product.countDocuments({ sellerId });
    
    // Aggregation for seller revenue
    const revenueData = await Order.aggregate([
      { $match: { "items.sellerId": sellerId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $match: { "items.sellerId": sellerId } },
      { 
        $group: { 
          _id: null, 
          totalEarnings: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalItemsSold: { $sum: "$items.quantity" }
        } 
      }
    ]);

    const stats = revenueData[0] || { totalEarnings: 0, totalItemsSold: 0 };

    return success(res, {
      totalProducts,
      totalEarnings: stats.totalEarnings,
      totalItemsSold: stats.totalItemsSold,
    }, "Seller statistics retrieved");
  } catch (err) { return error(res, err.message); }
};
