const router = require("express").Router();
const ctrl = require("../controllers/support.controller");

router.get("/", ctrl.getMyTickets);
router.post("/", ctrl.createTicket);
router.post("/:id/reply", ctrl.addReply);

module.exports = router;
