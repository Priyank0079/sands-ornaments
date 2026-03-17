const router = require("express").Router();
const paymentController = require("../controllers/payment.controller");
const authenticate = require("../../../middlewares/authenticate");

router.use(authenticate);

router.post("/create-order", paymentController.createRazorpayOrder);
router.post("/verify",       paymentController.verifyPayment);

module.exports = router;
