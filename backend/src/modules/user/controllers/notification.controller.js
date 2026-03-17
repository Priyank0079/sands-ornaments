const Notification = require("../../../models/Notification");
const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

// ── User: My Notifications ───────────────────────────────────────────────────
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Fetch user-specific + global broadcasts
    const notifications = await Notification.find({
      $or: [
        { userId },
        { isBroadcast: true }
      ]
    }).sort({ createdAt: -1 }).limit(50);

    return success(res, { notifications });
  } catch (err) { return error(res, err.message); }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return error(res, "Notification not found", 404);

    notification.read = true;
    await notification.save();

    return success(res, {}, "Marked as read");
  } catch (err) { return error(res, err.message); }
};
