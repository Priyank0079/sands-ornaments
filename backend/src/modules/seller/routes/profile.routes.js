const router = require("express").Router();
const profileController = require("../controllers/profile.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("seller"));

router.get("/me", profileController.getProfile);
router.put("/me", profileController.updateProfile);
router.put("/change-password", profileController.changePassword);

module.exports = router;
