const router = require("express").Router();
const pageController = require("../../admin/controllers/page.controller");

router.get("/:slug", pageController.getPageBySlug);

module.exports = router;
