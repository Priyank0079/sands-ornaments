const Notification = require("../models/Notification");

/**
 * Create a notification document in DB
 * @param {Object} params - { userId, title, message, type, link }
 * userId = null means it is a global/admin broadcast
 */
const createNotification = async ({ userId = null, title, message, type = "GENERAL", link = "" }) => {
  try {
    return await Notification.create({ userId, title, message, type, link });
  } catch (err) {
    console.error("[Notification] Failed to create:", err.message);
  }
};

/**
 * Broadcast a notification to all users (insert one doc per user)
 * For large user bases, replace with a queue-based approach.
 */
const broadcastNotification = async (title, message, type = "GENERAL", link = "") => {
  try {
    const User = require("../models/User");
    const users = await User.find({ role: "user", isBlocked: false }).select("_id");
    const docs  = users.map((u) => ({ userId: u._id, title, message, type, link }));
    return await Notification.insertMany(docs);
  } catch (err) {
    console.error("[Notification] Broadcast failed:", err.message);
  }
};

module.exports = { createNotification, broadcastNotification };
