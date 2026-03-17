const router = require("express").Router();
const productController = require("../controllers/product.controller");
const validate = require("../../../middlewares/validate");
const { productSchema } = require("../validators/product.validator");
const { productUpload } = require("../../../middlewares/uploadMiddleware");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductDetail);

router.post(
  "/",
  productUpload.array("images", 10),
  validate(productSchema),
  productController.createProduct
);

router.put(
  "/:id",
  productUpload.array("images", 10),
  validate(productSchema),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

router.patch("/bulk-price-update", productController.bulkPriceUpdate);

module.exports = router;
