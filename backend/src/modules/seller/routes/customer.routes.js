const router = require("express").Router();
const customerController = require("../controllers/customer.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("seller"));

router.get("/", customerController.getMyCustomers);

module.exports = router;
