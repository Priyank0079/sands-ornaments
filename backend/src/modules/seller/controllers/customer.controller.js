const Order = require("../../../models/Order");
const { success, error } = require("../../../utils/apiResponse");

exports.getMyCustomers = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    
    const customers = await Order.aggregate([
      { $match: { "items.sellerId": sellerId } },
      { $group: { _id: "$userId" } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", email: "$user.email", phone: "$user.phone" } }
    ]);

    return success(res, { customers });
  } catch (err) { return error(res, err.message); }
};
