const router = require("express").Router();
const supportController = require("../controllers/support.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("admin"));
router.get("/", supportController.getAllTickets);
router.post("/:id/reply", supportController.addAdminReply);

module.exports = router;
