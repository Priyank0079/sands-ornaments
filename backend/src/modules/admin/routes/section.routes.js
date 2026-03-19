const router = require("express").Router();
const sectionController = require("../controllers/section.controller");
const { sectionUpload } = require("../../../middlewares/uploadMiddleware");

router.get("/", sectionController.getSections);
router.post("/bulk", sectionController.bulkUpsertSections);
router.post("/upload-image", sectionUpload.single("image"), sectionController.uploadSectionImage);
router.get("/:id", sectionController.getSectionDetail);
router.put("/:id", sectionController.upsertSection);

module.exports = router;
