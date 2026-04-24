const router = require("express").Router();
const {
  otpLimiter,
  verifyOtpLimiter,
  sellerLoginLimiter,
  sellerRegisterLimiter,
  sellerResetOtpLimiter,
  sellerResetVerifyLimiter,
} = require("../../../middlewares/rateLimiter");
const userAuth   = require("../controllers/userAuth.controller");
const adminAuth  = require("../controllers/adminAuth.controller");
const sellerAuth = require("../controllers/sellerAuth.controller");
const { sellerUpload } = require("../../../middlewares/uploadMiddleware");

// User auth
router.post("/send-otp",    otpLimiter,       userAuth.sendOtp);
router.post("/verify-otp",  verifyOtpLimiter, userAuth.verifyOtp);
router.get("/me",           require("../../../middlewares/authenticate"), userAuth.getMe);
router.post("/logout",      userAuth.logout);

// Admin auth
router.post("/admin/login",  adminAuth.login);
router.post("/admin/logout", adminAuth.logout);

// Seller auth
router.post(
  "/seller/register",
  sellerRegisterLimiter,
  sellerUpload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "shopLicense", maxCount: 1 },
    { name: "certificate", maxCount: 1 }
  ]),
  sellerAuth.register
);
router.post("/seller/login",    sellerLoginLimiter, sellerAuth.login);
router.post("/seller/logout",   sellerAuth.logout);
router.post("/seller/send-reset-otp", sellerResetOtpLimiter, sellerAuth.sendResetOtp);
router.post("/seller/reset-password", sellerResetVerifyLimiter, sellerAuth.resetPassword);

module.exports = router;
