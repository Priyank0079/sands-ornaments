const bcrypt = require("bcryptjs");
const User = require("../../../models/User");
const { signToken } = require("../../../config/jwt");
const { success, error } = require("../../../utils/apiResponse");

/**
 * POST /api/auth/admin/login
 * Body: { email, password }
 * Returns: { token, user }  - token stored in localStorage on frontend
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required.", 400, "MISSING_FIELDS");
    }

    // Find admin user
    const admin = await User.findOne({ email: email.toLowerCase(), role: "admin" });
    if (!admin) {
      return error(res, "Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    if (admin.isBlocked) {
      return error(res, "This admin account is blocked.", 403, "ACCOUNT_BLOCKED");
    }

    // Compare password
    if (!admin.password) {
      return error(res, "Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, "Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    // Sign JWT
    const token = signToken({ userId: admin._id, role: "admin", email: admin.email });

    return success(
      res,
      {
        token,
        user: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      },
      "Admin login successful"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * POST /api/auth/admin/logout
 * Token is in localStorage on frontend - client simply removes it.
 */
exports.logout = async (req, res) => {
  return success(res, {}, "Admin logged out successfully");
};
