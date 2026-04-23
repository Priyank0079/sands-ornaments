const router = require("express").Router();
const productController = require("../controllers/product.controller");
const validate = require("../../../middlewares/validate");
const { productSchema } = require("../validators/product.validator");
const { productUpload } = require("../../../middlewares/uploadMiddleware");
const parseFormData = require("../../../middlewares/parseFormData");

const PRODUCT_COMPLEX_FIELDS = [
  "categories",
  "variants",
  "tags",
  "faqs",
  "deletedImages",
  "showInNavbar",
  "showInCollection",
  "navShopByCategory"
];

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductDetail);

router.post(
  "/",
  productUpload.any(),
  parseFormData(PRODUCT_COMPLEX_FIELDS),
  validate(productSchema),
  productController.createProduct
);

router.put(
  "/:id",
  productUpload.any(),
  parseFormData(PRODUCT_COMPLEX_FIELDS),
  validate(productSchema),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

router.patch("/:id/toggle-status", productController.toggleProductStatus);
router.patch("/bulk-price-update", productController.bulkPriceUpdate);
router.patch("/bulk/prices", productController.bulkPriceUpdate);

module.exports = router;
