const getMetalRate = (material = "", weightUnit = "Grams", rates = {}) => {
  const unit = String(weightUnit || "Grams").toLowerCase();
  const isGold = String(material || "").toLowerCase() === "gold";
  const perGram = isGold ? Number(rates.goldPerGram) || 0 : Number(rates.silverPerGram) || 0;
  const perMilligram = isGold ? Number(rates.goldPerMilligram) || 0 : Number(rates.silverPerMilligram) || 0;

  if (unit === "milligrams" || unit === "milligram") return perMilligram;
  return perGram;
};

const computeMetalPrice = (product = {}, rates = {}) => {
  const weight = Number(product.weight) || 0;
  const rate = getMetalRate(product.material, product.weightUnit, rates);
  return weight * rate;
};

const applyMetalPricingToProduct = (product, rates = {}, gstRate = 0) => {
  if (!product) return product;
  const gstValue = Number(gstRate) || 0;
  const metalPrice = computeMetalPrice(product, rates);

  if (Array.isArray(product.variants)) {
    product.variants = product.variants.map((variant) => {
      const makingCharge = Number(variant.makingCharge) || 0;
      const diamondPrice = Number(variant.diamondPrice) || 0;
      const finalPrice = metalPrice + makingCharge + diamondPrice + gstValue;

      return {
        ...variant,
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
