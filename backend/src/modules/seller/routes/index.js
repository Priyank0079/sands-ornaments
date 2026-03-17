const router = require("express").Router();

router.use("/products",  require("./product.routes"));
router.use("/orders",    require("./order.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/profile",   require("./profile.routes"));
router.use("/analytics", require("./analytics.routes"));
router.use("/customers", require("./customer.routes"));
router.use("/returns",   require("./return.routes"));

module.exports = router;
