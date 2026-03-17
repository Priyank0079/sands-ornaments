const User    = require("../../../models/User");
const OTP     = require("../../../models/OTP");
const { signToken } = require("../../../config/jwt");
const { sendOtpSms } = require("../../../services/smsService");
const { success, error } = require("../../../utils/apiResponse");

const OTP_MAX_ATTEMPTS = 5; // BUG-06: lockout after this many bad guesses

/**
 * POST /api/auth/send-otp
 * Body: { phone: "9876543210" }
 */
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return error(res, "Please provide a valid 10-digit Indian mobile number.", 400, "INVALID_PHONE");
    }

    // BUG-06 FIX: use a 6-digit OTP for stronger entropy (1,000,000 possibilities)
    const otp = process.env.USE_REAL_OTP === "true"
      ? String(Math.floor(100000 + Math.random() * 900000))
      : process.env.DEFAULT_OTP || "123456";

    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp, attempts: 0 });

    await sendOtpSms(phone, otp);

    // BUG-05 FIX: NEVER expose OTP in API response — log to server console in dev only
    if (process.env.USE_REAL_OTP !== "true") {
      console.log(`[DEV OTP] ${phone}: ${otp}`);
    }

    return success(res, {}, "OTP sent successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * POST /api/auth/verify-otp
 * Body: { phone, otp, name?, email? }
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;

    if (!phone || !otp) {
      return error(res, "Phone and OTP are required.", 400, "MISSING_FIELDS");
    }

    const otpRecord = await OTP.findOne({ phone });
    if (!otpRecord) {
      return error(res, "OTP expired or not found. Please request a new one.", 400, "OTP_EXPIRED");
    }

    // BUG-06 FIX: Enforce lockout after max attempts — invalidate OTP & force re-request
    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      await OTP.deleteMany({ phone });
      return error(res, "Too many failed attempts. Please request a new OTP.", 429, "OTP_MAX_ATTEMPTS");
    }

    if (otpRecord.otp !== String(otp)) {
      await OTP.updateOne({ phone }, { $inc: { attempts: 1 } });
      const remaining = OTP_MAX_ATTEMPTS - (otpRecord.attempts + 1);
      return error(res, `Invalid OTP. ${remaining} attempt(s) remaining.`, 400, "OTP_INVALID");
    }

    await OTP.deleteMany({ phone });

    let user = await User.findOne({ phone });
    const isNewUser = !user;

    if (isNewUser) {
      user = await User.create({
        phone,
        name:  name  || "Guest User",
        email: email || "",
        role:  "user",
      });
    } else {
      if (name  && name  !== user.name)  user.name  = name;
      if (email && email !== user.email) user.email = email;
      if (name || email) await user.save();
    }

    // BUG-04 FIX: Check isBlocked BEFORE issuing a token
    if (user.isBlocked) {
      return error(res, "Your account has been suspended. Please contact support.", 403, "ACCOUNT_BLOCKED");
    }

    const token = signToken({ userId: user._id, role: user.role, phone: user.phone });

    return success(
      res,
      {
        token,
        user: {
          _id:   user._id,
          name:  user.name,
          phone: user.phone,
          email: user.email,
          role:  user.role,
        },
        isNewUser,
      },
      isNewUser ? "Account created successfully" : "Login successful"
    );
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * GET /api/auth/me — Protected
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return error(res, "User not found.", 404, "USER_NOT_FOUND");

    // Also block mid-session if a user gets suspended while logged in
    if (user.isBlocked) {
      return error(res, "Your account has been suspended.", 403, "ACCOUNT_BLOCKED");
    }

    return success(res, { user }, "User profile retrieved");
  } catch (err) {
    return error(res, err.message);
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  return success(res, {}, "Logged out successfully");
};
