const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

exports.getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = { role: role || "user" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    return success(res, { users });
  } catch (err) { return error(res, err.message); }
};

exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, { user });
  } catch (err) { return error(res, err.message); }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, "User not found", 404);
    user.isBlocked = !user.isBlocked;
    await user.save();
    return success(res, { user }, `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`);
  } catch (err) { return error(res, err.message); }
};
