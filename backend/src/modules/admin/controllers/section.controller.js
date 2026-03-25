const HomepageSection = require("../../../models/HomepageSection");
const { success, error } = require("../../../utils/apiResponse");

const slugifyLabel = (value = "") => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/['"]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const buildNavPath = (sectionId, label, currentPath) => {
  const key = sectionId === "nav-gifts-for" ? "filter" : "occasion";
  const fallbackPath = `/shop?${key}=${encodeURIComponent(slugifyLabel(label))}`;
  if (!currentPath || !String(currentPath).trim()) return fallbackPath;
  if (String(currentPath).includes(`${key}=`)) return currentPath;
  return fallbackPath;
};

const parsePositiveNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const cleaned = String(value).replace(/[^0-9]/g, "");
  if (!cleaned) return null;
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

const buildCategoryPath = (categoryId, currentPath) => {
  if (categoryId) return `/shop?category=${categoryId}`;
  return currentPath || "/shop";
};

const buildPriceRangePath = (priceMax, currentPath) => {
  if (priceMax) return `/shop?price_max=${priceMax}`;
  return currentPath || "/shop";
};

const buildCategoryLimitPath = (categoryId, limit, sort, currentPath) => {
  if (categoryId && limit) return `/shop?category=${categoryId}&limit=${limit}&sort=${sort}`;
  return currentPath || `/shop?sort=${sort}`;
};

const sanitizeSectionPayload = (sectionId, payload = {}) => {
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
      priceMax: item.priceMax ?? undefined,
      extraImages: Array.isArray(item.extraImages) ? item.extraImages : undefined,
      sortOrder: item.sortOrder ?? idx
    })) : []
  };

  if (sectionId === "nav-gifts-for" || sectionId === "nav-occasions") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const label = item.name || item.label || '';
        return {
          ...item,
          name: label,
          label: label,
          path: buildNavPath(sectionId, label, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.name));
  }

  if (sectionId === "category-showcase") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const label = item.name || item.label || "";
        if (!categoryId) {
          return {
            ...item,
            name: label,
            label,
            sortOrder: item.sortOrder ?? idx
          };
        }

        return {
          ...item,
          categoryId,
          name: label,
          label: label || item.label,
          path: buildCategoryPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.categoryId));
  }

  if (sectionId === "price-range-showcase") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const priceMax = parsePositiveNumber(item.priceMax ?? item.price ?? item.name);
        if (!priceMax) {
          return {
            ...item,
            sortOrder: item.sortOrder ?? idx
          };
        }

        const name = item.name && String(item.name).trim()
          ? item.name
          : `Under INR ${priceMax}`;

        return {
          ...item,
          priceMax,
          price: String(priceMax),
          name,
          label: item.label || name,
          path: buildPriceRangePath(priceMax, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.priceMax));
  }

  if (sectionId === "latest-drop" || sectionId === "most-gifted" || sectionId === "proposal-rings") {
    const sort = sectionId === "most-gifted" ? "most-sold" : "latest";
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const limit = parsePositiveNumber(item.limit);
        if (!categoryId || !limit) {
          return {
            ...item,
            limit: limit || undefined,
            sortOrder: item.sortOrder ?? idx
          };
        }

        const label = item.name || item.label || "";

        return {
          ...item,
          categoryId,
          limit,
          name: label,
          label: item.label || label,
          path: buildCategoryLimitPath(categoryId, limit, sort, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.categoryId && item.limit));
  }

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
    const payload = sanitizeSectionPayload(id, req.body);
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
      const payload = sanitizeSectionPayload(section.sectionId, section);
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
