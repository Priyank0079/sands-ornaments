const router = require("express").Router();
const returnController = require("../controllers/return.controller");
const authenticate = require("../../../middlewares/authenticate");
const { evidenceUpload } = require("../../../middlewares/uploadMiddleware");

router.use(authenticate);
router.get("/", returnController.getMyReturns);
router.post("/", evidenceUpload.array("evidence", 5), returnController.requestReturn);

module.exports = router;
