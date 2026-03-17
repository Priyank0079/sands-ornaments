const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const authenticate = require("../../../middlewares/authenticate");

router.use(authenticate);
router.get("/", notificationController.getMyNotifications);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
