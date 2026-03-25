const sanitizeSegment = (value = "") =>
  String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 18);

const getLegacyProductCode = (product = {}) => {
  if (product.productCode) return product.productCode;
  const rawId = String(product._id || "LEGACY");
  return `PRD-LEGACY-${rawId.slice(-8).toUpperCase()}`;
};

const getLegacyVariantCode = (productCode, variant, index) => {
  if (variant?.variantCode) return variant.variantCode;
  return `VAR-${sanitizeSegment(productCode)}-${String(index + 1).padStart(2, "0")}`;
};

const normalizeProductForResponse = (product) => {
  if (!product) return product;

  const plainProduct = typeof product.toObject === "function"
    ? product.toObject({ virtuals: true })
    : { ...product };

  const fallbackWeight = plainProduct.weight !== undefined && plainProduct.weight !== null
    ? Number(plainProduct.weight) || 0
    : 0;
  const fallbackWeightUnit = plainProduct.weightUnit || "Grams";
  const productCode = getLegacyProductCode(plainProduct);

  plainProduct.productCode = productCode;
  plainProduct.variants = Array.isArray(plainProduct.variants)
    ? plainProduct.variants.map((variant, index) => ({
        ...variant,
        variantCode: getLegacyVariantCode(productCode, variant, index),
        weight: variant?.weight !== undefined && variant?.weight !== null && variant?.weight !== ""
          ? Number(variant.weight) || 0
          : fallbackWeight,
        weightUnit: variant?.weightUnit || fallbackWeightUnit
      }))
    : [];

  return plainProduct;
};

module.exports = {
  normalizeProductForResponse,
  getLegacyProductCode,
  getLegacyVariantCode
};
