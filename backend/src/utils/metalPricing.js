const getMetalRate = (material = "", weightUnit = "Grams", rates = {}) => {
  const unit = String(weightUnit || "Grams").toLowerCase();
  const isGold = String(material || "").toLowerCase() === "gold";
  const perGram = isGold ? Number(rates.goldPerGram) || 0 : Number(rates.silverPerGram) || 0;
  const perMilligram = isGold ? Number(rates.goldPerMilligram) || 0 : Number(rates.silverPerMilligram) || 0;

  if (unit === "milligrams" || unit === "milligram") return perMilligram;
  return perGram;
};

const computeMetalPrice = (material = "", weight = 0, weightUnit = "Grams", rates = {}) => {
  const normalizedWeight = Number(weight) || 0;
  const rate = getMetalRate(material, weightUnit, rates);
  return normalizedWeight * rate;
};

const roundCurrency = (value) => Math.round((Number(value) || 0) * 100) / 100;

const applyMetalPricingToProduct = (product, rates = {}, gstRate = 0) => {
  if (!product) return product;
  const gstPercentage = Number(gstRate) || 0;
  const productMaterial = product.material;
  const fallbackWeight = Number(product.weight) || 0;
  const fallbackWeightUnit = product.weightUnit || "Grams";

  if (Array.isArray(product.variants)) {
    product.variants = product.variants.map((variant) => {
      const variantWeight = variant.weight !== undefined && variant.weight !== null
        ? Number(variant.weight) || 0
        : fallbackWeight;
      const variantWeightUnit = variant.weightUnit || fallbackWeightUnit;
      const metalPrice = roundCurrency(
        computeMetalPrice(productMaterial, variantWeight, variantWeightUnit, rates)
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
