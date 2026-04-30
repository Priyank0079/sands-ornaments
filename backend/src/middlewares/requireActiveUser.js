const User = require("../models/User");
const { error } = require("../utils/apiResponse");

const requireActiveUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      return error(res, "Forbidden. User account required.", 403, "FORBIDDEN");
    }

    const user = await User.findById(req.user.userId).select("isBlocked isDeleted");
    if (!user) {
      return error(res, "User not found.", 401, "UNAUTHENTICATED");
    }

    if (user.isDeleted) {
      return error(res, "This account no longer exists.", 401, "ACCOUNT_DELETED");
    }

    if (user.isBlocked) {
      return error(
        res,
        "Your account has been suspended. Please contact support.",
        403,
        "ACCOUNT_BLOCKED"
      );
    }

    next();
  } catch (err) {
    return error(res, err.message || "User access check failed", 500, "USER_ACCESS_CHECK_FAILED");
  }
};

module.exports = requireActiveUser;

