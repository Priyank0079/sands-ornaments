const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const validate = require("../../../middlewares/validate");
const { createCategorySchema, updateCategorySchema } = require("../validators/category.validator");
const { categoryUpload } = require("../../../middlewares/uploadMiddleware");

// ── Categories ───────────────────────────────────────────────────────────────
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.post(
  "/",
  categoryUpload.single("image"),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  "/:id",
  categoryUpload.single("image"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
