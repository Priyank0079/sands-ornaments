const HomepageSection = require("../../../models/HomepageSection");
const { success, error } = require("../../../utils/apiResponse");

const sanitizeSectionPayload = (payload = {}) => {
  const cleaned = {
    label: payload.label,
    isActive: payload.isActive !== undefined ? payload.isActive : true,
    sortOrder: payload.sortOrder ?? 0,
    items: Array.isArray(payload.items) ? payload.items.map((item, idx) => ({
      itemId: item.itemId || item.id || item._id || `${Date.now()}_${idx}`,
      type: item.type || (item.productId ? "product" : "manual"),
      productId: item.productId || null,
      productIds: Array.isArray(item.productIds) ? item.productIds : undefined,
      categoryId: item.categoryId || null,
      limit: item.limit ?? undefined,
      name: item.name,
      label: item.label,
      image: item.image,
      path: item.path,
      tag: item.tag,
      price: item.price,
      extraImages: Array.isArray(item.extraImages) ? item.extraImages : undefined,
      sortOrder: item.sortOrder ?? idx
    })) : []
  };
  return cleaned;
};

exports.getSections = async (req, res) => {
  try {
    const sections = await HomepageSection.find().sort({ sortOrder: 1, createdAt: 1 });
    return success(res, { sections }, "Homepage sections retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getSectionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await HomepageSection.findOne({ sectionId: id }) || await HomepageSection.findById(id);
    if (!section) return error(res, "Section not found", 404);
    return success(res, { section }, "Homepage section retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.upsertSection = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = sanitizeSectionPayload(req.body);
    if (!payload.label) return error(res, "Section label is required", 400);

    const section = await HomepageSection.findOneAndUpdate(
      { sectionId: id },
      { $set: payload, $setOnInsert: { sectionId: id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return success(res, { section }, "Homepage section saved");
  } catch (err) { return error(res, err.message); }
};

exports.bulkUpsertSections = async (req, res) => {
  try {
    const sections = Array.isArray(req.body.sections) ? req.body.sections : [];
    if (sections.length === 0) return error(res, "No sections provided", 400);

    const ops = sections.map((section) => {
      if (!section.sectionId) return null;
      const payload = sanitizeSectionPayload(section);
      return HomepageSection.updateOne(
        { sectionId: section.sectionId },
        { $set: payload, $setOnInsert: { sectionId: section.sectionId } },
        { upsert: true }
      );
    }).filter(Boolean);

    await Promise.all(ops);

    const sectionIds = sections.map(s => s.sectionId);
    const savedSections = await HomepageSection.find({ sectionId: { $in: sectionIds } })
      .sort({ sortOrder: 1, createdAt: 1 });

    return success(res, { sections: savedSections }, "Homepage sections saved");
  } catch (err) { return error(res, err.message); }
};

exports.uploadSectionImage = async (req, res) => {
  try {
    if (!req.file) return error(res, "Image file is required", 400);
    return success(res, { url: req.file.path }, "Image uploaded");
  } catch (err) { return error(res, err.message); }
};
