const normalizeString = (value = "") => String(value || "").trim().toLowerCase();

const resolveMaterialPayload = (materialOrProduct = {}) => {
  if (materialOrProduct && typeof materialOrProduct === "object") {
    return {
      material: materialOrProduct.material,
      goldCategory: materialOrProduct.goldCategory,
      silverCategory: materialOrProduct.silverCategory
    };
  }

  return { material: materialOrProduct };
};

const getTenGramRate = (payload = {}, rates = {}) => {
  const material = normalizeString(payload.material);

  if (material === "gold") {
    const goldCategory = normalizeString(payload.goldCategory);
    const gold10g = rates.gold10g || {};

    if (goldCategory === "14") return Number(gold10g.k14) || Number(rates.goldPerGram || 0) * 10;
    if (goldCategory === "18") return Number(gold10g.k18) || Number(rates.goldPerGram || 0) * 10;
    if (goldCategory === "22") return Number(gold10g.k22) || Number(rates.goldPerGram || 0) * 10;
    if (goldCategory === "24") return Number(gold10g.k24) || Number(rates.goldPerGram || 0) * 10;

    const fallbackGold10g = Number(gold10g.k18)
      || Number(gold10g.k22)
      || Number(gold10g.k14)
      || Number(gold10g.k24);

    return fallbackGold10g || Number(rates.goldPerGram || 0) * 10;
  }

  if (material === "silver") {
    const silverCategory = normalizeString(payload.silverCategory);
    const silver10g = rates.silver10g || {};
    const isSterling = silverCategory === "925 sterling silver";
    if (isSterling) return Number(silver10g.sterling925) || Number(rates.silverPerGram || 0) * 10;
    return Number(silver10g.silverOther) || Number(rates.silverPerGram || 0) * 10;
  }

  return 0;
};

const getMetalRate = (materialOrProduct = "", weightUnit = "Grams", rates = {}) => {
  const unit = normalizeString(weightUnit || "Grams");
  const payload = resolveMaterialPayload(materialOrProduct);
  const perTenGram = Number(getTenGramRate(payload, rates)) || 0;
  const perGram = perTenGram / 10;
  const perMilligram = perGram / 1000;

  if (unit === "milligrams" || unit === "milligram") return perMilligram;
  return perGram;
};

const computeMetalPrice = (materialOrProduct = "", weight = 0, weightUnit = "Grams", rates = {}) => {
  const normalizedWeight = Number(weight) || 0;
  const rate = getMetalRate(materialOrProduct, weightUnit, rates);
  return normalizedWeight * rate;
};

const roundCurrency = (value) => Math.round((Number(value) || 0) * 100) / 100;

const applyMetalPricingToProduct = (product, rates = {}, gstRate = 0) => {
  if (!product) return product;
  const gstPercentage = Number(gstRate) || 0;
  const fallbackWeight = Number(product.weight) || 0;
  const fallbackWeightUnit = product.weightUnit || "Grams";

  if (Array.isArray(product.variants)) {
    product.variants = product.variants.map((variant) => {
      const variantWeight = variant.weight !== undefined && variant.weight !== null
        ? Number(variant.weight) || 0
        : fallbackWeight;
      const variantWeightUnit = variant.weightUnit || fallbackWeightUnit;
      const metalPrice = roundCurrency(
        computeMetalPrice(product, variantWeight, variantWeightUnit, rates)
      );
      const makingCharge = Number(variant.makingCharge) || 0;
      const diamondPrice = Number(variant.diamondPrice) || 0;
      const subtotal = roundCurrency(metalPrice + makingCharge + diamondPrice);
      const gstValue = roundCurrency((subtotal * gstPercentage) / 100);
      const finalPrice = roundCurrency(subtotal + gstValue);

      return {
        ...variant,
        weight: variantWeight,
        weightUnit: variantWeightUnit,
        metalPrice,
        gst: gstValue,
        finalPrice,
        price: finalPrice,
        mrp: finalPrice
      };
    });
  }

  return product;
};

module.exports = { applyMetalPricingToProduct, computeMetalPrice, getMetalRate };
