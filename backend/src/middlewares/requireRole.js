const { error } = require("../utils/apiResponse");
const Seller = require("../models/Seller");

const requireRole = (...roles) => async (req, res, next) => {
  try {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, "Forbidden. Insufficient permissions.", 403, "FORBIDDEN");
    }

    if (req.user.role === "seller") {
      const seller = await Seller.findById(req.user.userId).select("status");
      if (!seller) {
        return error(res, "Seller account not found.", 401, "UNAUTHENTICATED");
      }

      if (seller.status !== "APPROVED") {
        const message =
          seller.status === "REJECTED"
            ? "Seller account is rejected. Contact support for assistance."
            : "Seller account is pending approval.";
        return error(res, message, 403, "SELLER_NOT_APPROVED");
      }
    }

    next();
  } catch (err) {
    return error(res, err.message || "Authorization check failed", 500, "AUTHZ_CHECK_FAILED");
  }
};

module.exports = requireRole;
