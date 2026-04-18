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

const buildCelebrateMenPath = (celebrateKey, currentPath) => {
  if (celebrateKey) return `/shop?source=men&filter=${encodeURIComponent(celebrateKey)}`;
  return currentPath || "/shop?source=men&filter=men";
};

const buildMenCuratedCollectionPath = (categoryId, currentPath) => {
  if (categoryId) {
    return `/shop?source=men&filter=men&category=${encodeURIComponent(categoryId)}`;
  }
  return currentPath || "/shop?source=men&filter=men";
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
      step: item.step,
      buttonText: item.buttonText,
      line1: item.line1,
      line2: item.line2,
      description: item.description,
      image: item.image,
      hoverImage: item.hoverImage,
      celebrateKey: item.celebrateKey,
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

  if (sectionKey === "celebrate-men") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const celebrateKey = String(item.celebrateKey || "").trim();
        const label = item.name || item.label || "";

        if (!celebrateKey) {
          return {
            ...item,
            name: label,
            label,
            sortOrder: item.sortOrder ?? idx
          };
        }

        return {
          ...item,
          celebrateKey,
          name: label,
          label: item.label || label,
          path: buildCelebrateMenPath(celebrateKey, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter((item) => Boolean(item.celebrateKey));
  }

  if (sectionKey === "price-range-showcase" || sectionKey === "luxury-within-reach") {
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

  if (sectionKey === "curated-collections" && pageKey === "shop-men") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const label = item.name || item.label || "";

        if (!label || !item.image || (!categoryId && !item.path)) {
          return null;
        }

        return {
          ...item,
          categoryId,
          name: label,
          label: item.label || label,
          tag: item.tag || "",
          path: buildMenCuratedCollectionPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter(Boolean);
  }

  if (sectionKey === "explore-collections" && pageKey === "shop-men") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const label = item.name || item.label || "";
        const subtitle = item.subtitle || item.description || "";

        if (!label || !subtitle || !item.image || (!categoryId && !item.path)) {
          return null;
        }

        return {
          ...item,
          categoryId,
          name: label,
          label: item.label || label,
          subtitle,
          description: item.description || subtitle,
          path: buildMenCuratedCollectionPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter(Boolean);
  }

  if (sectionKey === "personalized-banner" && pageKey === "shop-men") {
    const sourceItem = cleaned.items[0];
    cleaned.items = sourceItem
      ? [{
          ...sourceItem,
          name: sourceItem.name || sourceItem.label || "Personalised",
          label: sourceItem.label || sourceItem.name || "Personalised",
          subtitle: sourceItem.subtitle || sourceItem.description || "",
          description: sourceItem.description || sourceItem.subtitle || "",
          ctaLabel: sourceItem.ctaLabel || "Customise Now",
          categoryId: sourceItem.categoryId || null,
          path: buildMenCuratedCollectionPath(sourceItem.categoryId || null, sourceItem.path),
          sortOrder: 0
        }].filter((item) => Boolean(item.image && item.categoryId))
      : [];
  }

  if (sectionKey === "pick-your-glam" && pageKey === "shop-men") {
    cleaned.items = cleaned.items
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const label = item.name || item.label || "";
        if (!label || !item.image || !categoryId) return null;
        return {
          ...item,
          name: label,
          label: item.label || label,
          categoryId,
          path: buildMenCuratedCollectionPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter(Boolean);
  }

  if (sectionKey === "style-guide" && pageKey === "shop-men") {
    cleaned.items = cleaned.items
      .slice(0, 3)
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const label = item.name || item.label || "";
        const step = item.step || `${idx + 1}. Step`;
        const buttonText = item.buttonText || item.ctaLabel || "Explore";
        if (!label || !step || !buttonText || !item.image || !categoryId) return null;
        return {
          ...item,
          name: label,
          label: item.label || label,
          step,
          buttonText,
          ctaLabel: buttonText,
          categoryId,
          path: buildMenCuratedCollectionPath(categoryId, item.path),
          sortOrder: idx
        };
      })
      .filter(Boolean);
  }

  if (sectionKey === "style-trends" && pageKey === "shop-men") {
    cleaned.items = cleaned.items
      .slice(0, 4)
      .map((item, idx) => {
        const categoryId = item.categoryId || null;
        const line1 = item.line1 || "";
        const line2 = item.line2 || "";
        const label = item.name || item.label || `${line1} ${line2}`.trim();
        if (!line1 || !line2 || !item.image || !categoryId) return null;
        return {
          ...item,
          name: label,
          label: item.label || label,
          line1,
          line2,
          categoryId,
          path: buildMenCuratedCollectionPath(categoryId, item.path),
          sortOrder: item.sortOrder ?? idx
        };
      })
      .filter(Boolean);
  }

  if (sectionKey === "products-listing" && pageKey === "shop-men") {
    const sourceModeCandidate = String(cleaned.settings?.sourceMode || "").trim().toLowerCase();
    const sourceMode = sourceModeCandidate === "manual" ? "manual" : "category";
    const productLimit = parsePositiveNumber(cleaned.settings?.productLimit) || 8;
    const categoryId = String(cleaned.settings?.categoryId || "").trim() || null;

    const manualProductIds = normalizeObjectIdList(
      cleaned.items.flatMap((item) => [
        item.productId,
        ...(Array.isArray(item.productIds) ? item.productIds : [])
      ])
    );

    cleaned.settings = {
      ...cleaned.settings,
      title: String(cleaned.settings?.title || "Men's Exclusive").trim() || "Men's Exclusive",
      productLimit,
      sourceMode,
      categoryId: sourceMode === "category" ? categoryId : null,
      ctaLabel: "View All Collection"
    };

    cleaned.items = sourceMode === "manual"
      ? manualProductIds.map((productId, idx) => ({
          itemId: `men-featured-${idx + 1}`,
          type: "product",
          productId,
          path: "/shop?source=men&filter=men",
          sortOrder: idx
        }))
      : [];
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
    const url = req.file.path || req.file.secure_url || req.file.url || null;
    if (!url) return error(res, "Image upload succeeded but no file URL was returned", 500);
    return success(res, { url }, "Image uploaded");
  } catch (err) { return error(res, err.message); }
};
