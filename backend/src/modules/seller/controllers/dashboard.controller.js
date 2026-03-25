const Order = require("../../../models/Order");
const Product = require("../../../models/Product");
const Return = require("../../../models/Return");
const { success, error } = require("../../../utils/apiResponse");

exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const sellerProducts = await Product.find({ sellerId })
      .select("_id categories variants name images")
      .populate("categories", "name");

    const sellerProductIds = sellerProducts.map((product) => product._id);
    const totalProducts = sellerProducts.length;
    const totalStock = sellerProducts.reduce((sum, product) => (
      sum + (product.variants || []).reduce((variantSum, variant) => variantSum + (Number(variant.stock) || 0), 0)
    ), 0);
    const lowStockProducts = sellerProducts
      .flatMap((product) => (product.variants || []).map((variant) => ({
        productId: product._id,
        name: product.name,
        variantName: variant.name || "Standard",
        stock: Number(variant.stock) || 0
      })))
      .filter((item) => item.stock <= 5);

    const orders = await Order.find({ "items.sellerId": sellerId })
      .populate("userId", "fullName name email")
      .populate("items.productId", "name images")
      .sort({ createdAt: -1 });

    let pendingOrders = 0;
    let acceptedOrders = 0;
    let deliveredOrders = 0;
    let totalRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
      const sellerItems = (order.items || []).filter((item) => String(item.sellerId) === String(sellerId));
      const sellerSubtotal = sellerItems.reduce((sum, item) => (
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 0)
      ), 0);
      const sellerUnits = sellerItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

      if (["Processing", "Confirmed", "Packed"].includes(order.status)) pendingOrders += 1;
      if (["Shipped", "Out for Delivery"].includes(order.status)) acceptedOrders += 1;
      if (order.status === "Delivered") {
        deliveredOrders += 1;
        totalRevenue += sellerSubtotal;
        totalItemsSold += sellerUnits;
      }
    });

    const returns = sellerProductIds.length
      ? await Return.find({ "items.productId": { $in: sellerProductIds } }).select("status items createdAt requestDate")
      : [];

    const recentOrders = orders.slice(0, 5);
    const today = new Date();
    const dailyOrders = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      const dayKey = day.toISOString().slice(0, 10);
      const count = orders.filter((order) => order.createdAt.toISOString().slice(0, 10) === dayKey).length;
      return {
        date: day.toLocaleDateString("en-US", { weekday: "short" }),
        count
      };
    });

    const categoryCounts = new Map();
    sellerProducts.forEach((product) => {
      const categoryName = product.categories?.[0]?.name || "Uncategorized";
      categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);
    });
    const totalCategoryProducts = Math.max(totalProducts, 1);
    const categoryPerformance = Array.from(categoryCounts.entries())
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalCategoryProducts) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const weeklyRevenue = Array.from({ length: 4 }, (_, index) => {
      const start = new Date(today);
      start.setDate(today.getDate() - ((3 - index) * 7 + 6));
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const revenue = orders.reduce((sum, order) => {
        if (order.status !== "Delivered") return sum;
        if (order.createdAt < start || order.createdAt > end) return sum;
        const sellerItems = (order.items || []).filter((item) => String(item.sellerId) === String(sellerId));
        return sum + sellerItems.reduce((itemSum, item) => (
          itemSum + (Number(item.price) || 0) * (Number(item.quantity) || 0)
        ), 0);
      }, 0);

      return {
        week: `W${index + 1}`,
        revenue
      };
    });

    return success(res, {
      totalProducts,
      totalEarnings: totalRevenue,
      totalItemsSold,
      stats: {
        totalProducts,
        totalStock,
        pendingOrders,
        acceptedOrders,
        deliveredOrders,
        returnRequests: returns.length,
        totalRevenue,
        lowStockProducts
      },
      recentOrders,
      analytics: {
        todayStats: {
          orders: dailyOrders[dailyOrders.length - 1]?.count || 0
        },
        monthlyStats: {
          revenue: weeklyRevenue.reduce((sum, item) => sum + item.revenue, 0)
        },
        dailyOrders,
        categoryPerformance,
        weeklyRevenue
      }
    }, "Seller statistics retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const orders = await Order.find({ "items.sellerId": sellerId })
      .populate("userId", "fullName name email")
      .populate("items.productId", "name images")
      .sort({ createdAt: -1 })
      .limit(5);

    return success(res, { recentOrders: orders }, "Recent seller orders retrieved");
  } catch (err) { return error(res, err.message); }
};
