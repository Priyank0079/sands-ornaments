const router = require("express").Router();
const returnController = require("../controllers/return.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");
const requireActiveUser = require("../../../middlewares/requireActiveUser");
const { evidenceUpload } = require("../../../middlewares/uploadMiddleware");

router.use(authenticate, requireRole("user", "seller", "admin"), requireActiveUser);
router.get("/", returnController.getMyReturns);
router.post("/", evidenceUpload.array("evidence", 5), returnController.requestReturn);

module.exports = router;
