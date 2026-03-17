const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const validate = require("../../../middlewares/validate");
const { categorySchema, subcategorySchema } = require("../validators/category.validator");
const { categoryUpload } = require("../../../middlewares/uploadMiddleware");

// ── Categories ───────────────────────────────────────────────────────────────
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.post(
  "/",
  categoryUpload.single("image"),
  validate(categorySchema),
  categoryController.createCategory
);

router.put(
  "/:id",
  categoryUpload.single("image"),
  validate(categorySchema),
  categoryController.updateCategory
);

router.delete("/:id", categoryController.deleteCategory);

// ── Subcategories ────────────────────────────────────────────────────────────
router.post(
  "/subcategories",
  validate(subcategorySchema),
  categoryController.createSubcategory
);

router.put(
  "/subcategories/:id",
  validate(subcategorySchema),
  categoryController.updateSubcategory
);

router.delete("/subcategories/:id", categoryController.deleteSubcategory);

module.exports = router;
