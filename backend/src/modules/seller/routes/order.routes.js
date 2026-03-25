const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("seller"));

router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getMyOrderDetail);
router.patch("/:orderId/status", orderController.updateOrderStatus);
router.patch("/:orderId/items/:itemId/status", orderController.updateOrderStatus);

module.exports = router;
