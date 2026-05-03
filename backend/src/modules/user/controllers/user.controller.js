const User = require("../../../models/User");
const Address = require("../../../models/Address");
const Notification = require("../../../models/Notification");
const OTP = require("../../../models/OTP");
const SupportTicket = require("../../../models/SupportTicket");
const Review = require("../../../models/Review");
const { success, error } = require("../../../utils/apiResponse");

const buildDeletedPhoneValue = (userId) => `deleted_${String(userId)}_${Date.now()}`;

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
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return error(res, "User not found", 404);

    if (user.isDeleted) {
      return error(res, "Account already deleted", 400);
    }

    await Promise.all([
      Address.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      OTP.deleteMany({ phone: user.phone }),
      SupportTicket.deleteMany({ userId }),
      Review.deleteMany({ userId })
    ]);

    // Preserve the row for historical order/return references while removing
    // personally identifying data and freeing the original phone number.
    user.name = "Deleted User";
    user.phone = buildDeletedPhoneValue(userId);
    user.email = "";
    user.password = null;
    user.points = 0;
    user.usedCoupons = [];
    user.wishlist = [];
    user.notificationsEnabled = false;
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    return success(res, {}, "Account deleted successfully");
  } catch (err) { return error(res, err.message); }
};
