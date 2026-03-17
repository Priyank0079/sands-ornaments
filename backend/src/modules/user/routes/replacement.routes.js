const router = require("express").Router();
const replacementController = require("../controllers/replacement.controller");
const authenticate = require("../../../middlewares/authenticate");
const { evidenceUpload } = require("../../../middlewares/uploadMiddleware");

router.use(authenticate);
router.get("/", replacementController.getMyReplacements);
router.post("/", evidenceUpload.array("evidence", 5), replacementController.requestReplacement);

module.exports = router;
