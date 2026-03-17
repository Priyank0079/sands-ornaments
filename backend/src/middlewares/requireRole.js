const { error } = require("../utils/apiResponse");

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return error(res, "Forbidden. Insufficient permissions.", 403, "FORBIDDEN");
  }
  next();
};

module.exports = requireRole;
