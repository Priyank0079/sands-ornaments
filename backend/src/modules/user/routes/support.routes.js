const router = require("express").Router();
const supportController = require("../controllers/support.controller");
const authenticate = require("../../../middlewares/authenticate");

router.use(authenticate);
router.get("/", supportController.getMyTickets);
router.post("/", supportController.createTicket);
router.post("/:id/reply", supportController.addReply);

module.exports = router;
