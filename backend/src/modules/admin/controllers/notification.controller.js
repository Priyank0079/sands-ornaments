const Notification = require("../../../models/Notification");
const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isBroadcast: true }).sort({ createdAt: -1 });
    return success(res, { notifications });
  } catch (err) { return error(res, err.message); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return error(res, "Notification not found", 404);
    return success(res, { notification }, "Notification marked as read");
  } catch (err) { return error(res, err.message); }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isBroadcast: true, isRead: false }, { isRead: true });
    return success(res, {}, "All notifications marked as read");
  } catch (err) { return error(res, err.message); }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return error(res, "Notification not found", 404);
    return success(res, {}, "Notification deleted");
  } catch (err) { return error(res, err.message); }
};

exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type, link, priority } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type: type || "GENERAL",
      priority: priority || "Medium",
      link,
      isBroadcast: true
    });
    return success(res, { notification }, "Notification broadcasted successfully", 201);
  } catch (err) { return error(res, err.message); }
};
