const router = require("express").Router();
const paymentController = require("../controllers/payment.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");
const requireActiveUser = require("../../../middlewares/requireActiveUser");

router.use(authenticate, requireRole("user"), requireActiveUser);

router.post("/create-order", paymentController.createRazorpayOrder);
router.post("/verify",       paymentController.verifyPayment);

module.exports = router;
