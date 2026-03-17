const router = require("express").Router();
const analyticsController = require("../controllers/analytics.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");

router.use(authenticate, requireRole("seller"));

router.get("/sales-trend", analyticsController.getSalesTrend);
router.get("/product-performance", analyticsController.getProductPerformance);

module.exports = router;
