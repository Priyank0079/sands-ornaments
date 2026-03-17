const router = require("express").Router();
const productController = require("../controllers/product.controller");
const authenticate = require("../../../middlewares/authenticate");
const requireRole = require("../../../middlewares/requireRole");
const { productUpload } = require("../../../middlewares/uploadMiddleware");

router.use(authenticate, requireRole("seller"));

router.get("/", productController.getMyProducts);
router.post("/", productUpload.array("images", 10), productController.createProduct);
router.put("/:id", productUpload.array("images", 10), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
