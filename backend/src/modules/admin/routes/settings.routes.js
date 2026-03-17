const router = require("express").Router();
const settingsController = require("../controllers/settings.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("admin"));

router.get("/", settingsController.getSettings);
router.put("/", settingsController.updateSettings);

module.exports = router;
