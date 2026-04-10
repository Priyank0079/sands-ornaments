const router = require("express").Router();

router.use("/products",   require("./product.routes"));
router.use("/categories", require("./category.routes"));
router.use("/banners",    require("./banner.routes"));
router.use("/coupons",    require("./coupon.routes"));
router.use("/blogs",      require("./blog.routes"));
router.use("/faqs",       require("./faq.routes"));
router.use("/reviews",    require("./review.routes"));
router.use("/cms",        require("./cms.routes"));
router.use("/pages",      require("./page.routes"));
router.use("/contact",    require("./contact.routes"));

module.exports = router;
