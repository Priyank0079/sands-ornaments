const router = require("express").Router();

router.use("/",          require("./dashboard.routes"));
router.use("/orders",        require("./order.routes"));
router.use("/products",      require("./product.routes"));
router.use("/categories",    require("./category.routes"));
router.use("/coupons",       require("./coupon.routes"));
router.use("/users",         require("./user.routes"));
router.use("/returns",       require("./return.routes"));
router.use("/replacements",  require("./replacement.routes"));
router.use("/reviews",       require("./review.routes"));
router.use("/support",       require("./support.routes"));
router.use("/sellers",       require("./seller.routes"));
router.use("/inventory",     require("./inventory.routes"));
router.use("/notifications", require("./notification.routes"));
router.use("/cms",           require("./cms.routes"));
router.use("/settings",      require("./settings.routes"));
router.use("/blogs",         require("./blog.routes"));
router.use("/pages",         require("./page.routes"));
router.use("/sections",      require("./section.routes"));

module.exports = router;
