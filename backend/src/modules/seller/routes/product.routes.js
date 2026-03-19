const router = require("express").Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");
const { productUpload } = require("../../../middlewares/uploadMiddleware");
const parseFormData = require("../../../middlewares/parseFormData");

const SELLER_COMPLEX_FIELDS = [
  "categories",
  "tags",
  "variants",
  "sizes",
  "navGiftsFor",
  "navOccasions"
];

router.use(authenticate, requireRole("seller"));

router.get("/", productController.getMyProducts);
router.get("/:id", productController.getMyProduct);
router.post(
  "/", 
  productUpload.array("images", 10), 
  parseFormData(SELLER_COMPLEX_FIELDS),
  productController.createProduct
);
router.put(
  "/:id", 
  productUpload.array("images", 10), 
  parseFormData(SELLER_COMPLEX_FIELDS),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
