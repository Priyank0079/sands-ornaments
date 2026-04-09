const HomepageSection = require("../../../models/HomepageSection");
const { success, error } = require("../../../utils/apiResponse");

const ALLOWED_PAGE_KEYS = new Set(["home", "shop-men", "shop-women", "shop-family"]);
const ALLOWED_SECTION_TYPES = new Set([
  "banner",
  "category-grid",
  "product-collection",
  "product-carousel",
  "promo-grid",
  "faq",
  "testimonial",
  "nav-links",
  "rich-content"
]);

const normalizePageKey = (value) => {
  const candidate = String(value || "home").trim().toLowerCase();
  return ALLOWED_PAGE_KEYS.has(candidate) ? candidate : "home";
};

const normalizeSectionType = (value) => {
  const candidate = String(value || "rich-content").trim().toLowerCase();
  return ALLOWED_SECTION_TYPES.has(candidate) ? candidate : "rich-content";
};

const buildSectionId = (pageKey, sectionKey) => (
  pageKey === "home" ? sectionKey : `${pageKey}:${sectionKey}`
);

const normalizeSectionIdentity = (id, payload = {}, query = {}) => {
  const payloadPageKey = payload.pageKey || query.pageKey;
  const pageKey = normalizePageKey(payloadPageKey);

  if (payload.sectionKey) {
    const sectionKey = String(payload.sectionKey).trim();
    return {
      pageKey,
      sectionKey,
      sectionId: buildSectionId(pageKey, sectionKey)
    };
  }

  const rawId = String(id || payload.sectionId || "").trim();
  if (rawId.includes(":")) {
    const [rawPageKey, ...sectionKeyParts] = rawId.split(":");
    const parsedPageKey = normalizePageKey(rawPageKey);
    const sectionKey = sectionKeyParts.join(":");
    return {
      pageKey: parsedPageKey,
      sectionKey,
      sectionId: buildSectionId(parsedPageKey, sectionKey)
    };
  }

  const sectionKey = rawId;
  return {
    pageKey,
    sectionKey,
    sectionId: buildSectionId(pageKey, sectionKey)
  };
};

const buildSectionLookup = ({ pageKey, sectionKey, sectionId }) => {
  if (!sectionKey) {
    return sectionId ? { $or: [{ sectionId }, { _id: sectionId }] } : null;
  }

  return {
    $or: [
      { pageKey, sectionKey },
      { sectionId },
      ...(pageKey === "home" ? [{ sectionId: sectionKey }] : [])
    ]
  };
};

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

const normalizeObjectIdList = (values = []) => (
  Array.isArray(values)
    ? values.map((value) => String(value || "").trim()).filter(Boolean)
    : []
);

const buildProductsPath = (productIds, currentPath) => {
  const ids = normalizeObjectIdList(productIds);
  if (ids.length > 0) return `/shop?products=${encodeURIComponent(ids.join(","))}`;
  return currentPath || "/shop?status=coming-soon";
};

const buildRandomizedProductsPath = (productIds, limit, currentPath) => {
  const ids = normalizeObjectIdList(productIds);
  if (ids.length > 0) {
    const safeLimit = parsePositiveNumber(limit);
    return safeLimit
      ? `/shop?products=${encodeURIComponent(ids.join(","))}&limit=${safeLimit}&sort=random`
      : `/shop?products=${encodeURIComponent(ids.join(","))}&sort=random`;
  }
  if (limit) return `/shop?limit=${limit}&sort=random`;
  return currentPath || "/shop?limit=12&sort=random";
};

const sanitizeSectionPayload = (identity, payload = {}) => {
  const pageKey = normalizePageKey(identity?.pageKey || payload.pageKey);
  const sectionKey = String(identity?.sectionKey || payload.sectionKey || identity?.sectionId || payload.sectionId || "").trim();
  const sectionId = identity?.sectionId || buildSectionId(pageKey, sectionKey);

  const cleaned = {
    pageKey,
    sectionKey,
    sectionId,
    sectionType: normalizeSectionType(payload.sectionType),
    label: payload.label,
    isActive: payload.isActive !== undefined ? payload.isActive : true,
    sortOrder: payload.sortOrder ?? 0,
    settings: payload.settings && typeof payload.settings === "object" && !Array.isArray(payload.settings)
      ? payload.settings
      : {},
    items: Array.isArray(payload.items) ? payload.items.map((item, idx) => ({
      itemId: item.itemId || item.id || item._id || `${Date.now()}_${idx}`,
      type: item.type || (item.productId ? "product" : "manual"),
      productId: item.productId || null,
      productIds: Array.isArray(item.productIds) ? item.productIds : undefined,
      categoryId: item.categoryId || null,
      limit: item.limit ?? undefined,
      name: item.name,
      label: item.label,
      subtitle: item.subtitle,
      description: item.description,
      image: item.image,
      hoverImage: item.hoverImage,
      path: item.path,
      tag: item.tag,
      location: item.location,
      rating: item.rating ?? undefined,
      price: item.price,
      ctaLabel: item.ctaLabel,
      priceMax: item.priceMax ?? undefined,
      extraImages: Array.isArray(item.extraImages) ? item.extraImages : undefined,
      sortOrder: item.sortOrder ?? idx
    })) : []
  };

  if (sectionKey === "nav-gifts-for" || sectionKey === "nav-occasions") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const label = item.name || item.label || '';
        return {
          ...item,
          name: label,
          label: label,
          path: buildNavPath(sectionKey, label, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.name));
  }

  if (sectionKey === "category-showcase") {
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
          hoverImage: item.hoverImage,
          path: buildCategoryPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.categoryId));
  }

  if (sectionKey === "price-range-showcase") {
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

  if (sectionKey === "latest-drop" || sectionKey === "most-gifted") {
    const sort = sectionKey === "most-gifted" ? "most-sold" : "latest";
    cleaned.items = cleaned.items
      .map((item, idx) => {
        if (sectionKey === "most-gifted" && item.type === "hero") {
          const label = item.label || item.name || "Most Gifted Items";
          return {
            ...item,
            type: "hero",
            name: item.name || label,
            label,
            tag: item.tag || "Collection Focus",
            ctaLabel: item.ctaLabel || "Explore Collection",
            path: item.path || "/shop?sort=most-sold",
            sortOrder: item.sortOrder ?? idx
          };
        }

        const categoryId = item.categoryId || null;
        const limit = parsePositiveNumber(item.limit);
        if (sectionKey === "most-gifted") {
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
            limit: undefined,
            name: label,
            label: item.label || label,
            path: `/shop?category=${categoryId}&sort=most-sold`,
            sortOrder: item.sortOrder ?? idx
          };
        }

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
      .filter((item) => item.type === "hero" || (sectionKey === "most-gifted" ? Boolean(item.categoryId) : Boolean(item.categoryId && item.limit)));
  }

  if (sectionKey === "proposal-rings") {
    const sourceItem = cleaned.items.find((item) => Boolean(item.categoryId)) || cleaned.items[0];
    cleaned.items = sourceItem
      ? [
          {
            ...sourceItem,
            categoryId: sourceItem.categoryId || null,
            limit: undefined,
            name: sourceItem.name || sourceItem.label || "Proposal Rings",
            label: sourceItem.label || sourceItem.name || "Proposal Rings",
            path: sourceItem.categoryId ? `/shop?category=${sourceItem.categoryId}` : (sourceItem.path || "/shop"),
            sortOrder: 0
          }
        ].filter((item) => Boolean(item.categoryId))
      : [];
  }

  if (sectionKey === "perfect-gift") {
    cleaned.items = cleaned.items.map((item, idx) => {
      const productIds = normalizeObjectIdList(item.productIds);
      const label = item.name || item.label || "";
      return {
        ...item,
        productIds,
        name: label,
        label: item.label || label,
        path: buildProductsPath(productIds, item.path),
        sortOrder: item.sortOrder ?? idx
      };
    });
  }

  if (sectionKey === "new-launch") {
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
          productIds: undefined,
          name: label,
          label: item.label || label,
          path: buildCategoryPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.categoryId));
  }

  if (sectionKey === "curated-for-you" || sectionKey === "style-it-your-way") {
    cleaned.items = cleaned.items.map((item, idx) => {
      const productIds = normalizeObjectIdList(item.productIds);
      const limit = parsePositiveNumber(item.limit) || 12;
      const label = item.name || item.label || "";
      return {
        ...item,
        productIds,
        limit,
        name: label,
        label: item.label || label,
        extraImages: Array.isArray(item.extraImages)
          ? item.extraImages.map((img) => String(img || "").trim())
          : undefined,
        path: buildRandomizedProductsPath(productIds, limit, item.path),
        sortOrder: item.sortOrder ?? idx
      };
    });
  }

  return cleaned;
};

exports.getSections = async (req, res) => {
  try {
    const pageKey = req.query.pageKey ? normalizePageKey(req.query.pageKey) : null;
    const filter = pageKey ? { pageKey } : {};
    const sections = await HomepageSection.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    return success(res, { sections }, "Homepage sections retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getSectionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = normalizeSectionIdentity(id, {}, req.query);
    const lookup = buildSectionLookup(identity);
    const section = lookup
      ? await HomepageSection.findOne(lookup) || await HomepageSection.findById(id)
      : null;
    if (!section) return error(res, "Section not found", 404);
    return success(res, { section }, "Homepage section retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.upsertSection = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = normalizeSectionIdentity(id, req.body, req.query);
    const payload = sanitizeSectionPayload(identity, req.body);
    if (!payload.label) return error(res, "Section label is required", 400);

    const lookup = buildSectionLookup(identity);
    const section = await HomepageSection.findOneAndUpdate(
      lookup,
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return success(res, { section }, "Homepage section saved");
  } catch (err) { return error(res, err.message); }
};

exports.bulkUpsertSections = async (req, res) => {
  try {
    const sections = Array.isArray(req.body.sections) ? req.body.sections : [];
    if (sections.length === 0) return error(res, "No sections provided", 400);
    const fallbackPageKey = normalizePageKey(req.body.pageKey);

    const ops = sections.map((section) => {
      if (!section.sectionId && !section.sectionKey) return null;
      const identity = normalizeSectionIdentity(section.sectionId || section.sectionKey, { ...section, pageKey: section.pageKey || fallbackPageKey });
      const payload = sanitizeSectionPayload(identity, { ...section, pageKey: identity.pageKey });
      return HomepageSection.updateOne(
        buildSectionLookup(identity),
        { $set: payload },
        { upsert: true }
      );
    }).filter(Boolean);

    await Promise.all(ops);

    const requestedPageKeys = [...new Set(sections.map((section) => normalizePageKey(section.pageKey || fallbackPageKey)))];
    const requestedSectionKeys = sections
      .map((section) => normalizeSectionIdentity(section.sectionId || section.sectionKey, { ...section, pageKey: section.pageKey || fallbackPageKey }).sectionKey)
      .filter(Boolean);

    const savedSections = await HomepageSection.find({
      pageKey: { $in: requestedPageKeys },
      sectionKey: { $in: requestedSectionKeys }
    })
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
