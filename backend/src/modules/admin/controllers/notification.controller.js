const Notification = require("../../../models/Notification");
const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isBroadcast: true }).sort({ createdAt: -1 });
    return success(res, { notifications });
  } catch (err) { return error(res, err.message); }
};

exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type, link } = req.body;
    const notification = await Notification.create({
      title,
      message,
      type: type || "info",
      link,
      isBroadcast: true
    });
    return success(res, { notification }, "Notification broadcasted successfully", 201);
  } catch (err) { return error(res, err.message); }
};
