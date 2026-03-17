const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("seller"));

router.get("/", orderController.getMyOrders);
router.patch("/:orderId/items/:itemId/status", orderController.updateOrderItemStatus);

module.exports = router;
