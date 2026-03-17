const router = require("express").Router();
const { otpLimiter, verifyOtpLimiter } = require("../../../middlewares/rateLimiter");
const userAuth   = require("../controllers/userAuth.controller");
const adminAuth  = require("../controllers/adminAuth.controller");
const sellerAuth = require("../controllers/sellerAuth.controller");

// User auth
router.post("/send-otp",    otpLimiter,       userAuth.sendOtp);
router.post("/verify-otp",  verifyOtpLimiter, userAuth.verifyOtp);
router.get("/me",           require("../../../middlewares/authenticate"), userAuth.getMe);
router.post("/logout",      userAuth.logout);

// Admin auth
router.post("/admin/login",  adminAuth.login);
router.post("/admin/logout", adminAuth.logout);

// Seller auth
router.post("/seller/register", sellerAuth.register);
router.post("/seller/login",    sellerAuth.login);
router.post("/seller/logout",   sellerAuth.logout);

module.exports = router;
