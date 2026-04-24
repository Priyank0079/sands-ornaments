const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");
const requireActiveUser = require("../../../middlewares/requireActiveUser");

router.use(authenticate, requireRole("user"), requireActiveUser);
router.get("/", notificationController.getMyNotifications);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
