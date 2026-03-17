const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("admin"));
router.post("/broadcast", notificationController.broadcastNotification);

module.exports = router;
