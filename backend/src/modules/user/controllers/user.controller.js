const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return error(res, "User not found", 404);
    return success(res, { user });
  } catch (err) { return error(res, err.message); }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true }).select("-password");
    return success(res, { user }, "Profile updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    return success(res, {}, "Account deleted successfully");
  } catch (err) { return error(res, err.message); }
};
