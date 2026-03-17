const router = require("express").Router();
const productController = require("../controllers/product.controller");

router.get("/",           productController.getProducts);
router.get("/:slug",      productController.getProductDetail);
router.get("/search",         productController.searchProducts);

module.exports = router;
