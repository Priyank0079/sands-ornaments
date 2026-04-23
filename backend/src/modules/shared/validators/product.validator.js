const Joi = require("joi");

const boolField = Joi.boolean().truthy("true").falsy("false");

const variantSchema = Joi.object({
  _id: Joi.string().trim().allow(""),
  name: Joi.string().required().trim(),
  variantCode: Joi.string().trim().allow(""),
  mrp: Joi.number().min(0).optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().integer().required().min(0),
  sold: Joi.number().integer().min(0).optional(),
  discount: Joi.number().min(0).max(100),
  weight: Joi.number().min(0).optional(),
  weightUnit: Joi.string().valid("Grams", "Milligrams").optional(),
  metalPrice: Joi.number().min(0).optional(),
  makingCharge: Joi.number().min(0).optional(),
  diamondPrice: Joi.number().min(0).optional(),
  hallmarkingCharge: Joi.number().min(0).optional(),
  diamondCertificateCharge: Joi.number().min(0).optional(),
  hiddenCharge: Joi.number().min(0).optional(),
  subtotalBeforeTax: Joi.number().min(0).optional(),
  gstAmount: Joi.number().min(0).optional(),
  priceAfterTax: Joi.number().min(0).optional(),
  pgChargePercent: Joi.number().min(0).optional(),
  pgChargeAmount: Joi.number().min(0).optional(),
  gst: Joi.number().min(0).optional(),
  finalPrice: Joi.number().min(0).optional(),
  variantImages: Joi.array().items(Joi.string().trim()).optional(),
  variantFaqs: Joi.array().items(Joi.object({
    _id: Joi.string().trim().allow(""),
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required()
  })).optional(),
  serialCodes: Joi.array().items(Joi.object({
    _id: Joi.string().trim().allow(""),
    code: Joi.string().trim().required(),
    status: Joi.string().valid("AVAILABLE", "SOLD_OFFLINE", "SOLD_ONLINE").optional()
  })).optional()
});

const productSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100),
  productCode: Joi.string().trim().allow(""),
  slug: Joi.string().trim().lowercase(),
  brand: Joi.string().default("SANDS"),
  categories: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).max(1).required(),
  description: Joi.string().required(),
  stylingTips: Joi.string().allow(""),
  careTips: Joi.string().allow(""),
  material: Joi.string().required(),
  silverCategory: Joi.string().allow(""),
  goldCategory: Joi.string().allow(""),
  weight: Joi.number().min(0),
  weightUnit: Joi.string().valid("Grams", "Milligrams").default("Grams"),
  specifications: Joi.string().allow(""),
  supplierInfo: Joi.string().allow(""),
  cardLabel: Joi.string().allow(""),
  cardBadge: Joi.string().allow(""),
  paymentGatewayChargeBearer: Joi.string().valid("seller", "user").default("seller"),
  huid: Joi.string().allow(""),
  sizes: Joi.array().items(Joi.string().trim()).optional(),
  variants: Joi.array().items(variantSchema).min(1).required(),
  tags: Joi.object({
    isNewArrival: boolField,
    isMostGifted: boolField,
    isNewLaunch: boolField,
    isTrending: boolField,
    isPremium: boolField
  }),
  status: Joi.string().valid("Active", "Draft", "Archived").default("Active"),
  showInNavbar: boolField,
  showInCollection: boolField,
  active: boolField,
  navGiftsFor: Joi.array().items(Joi.string().trim()).optional(),
  navOccasions: Joi.array().items(Joi.string().trim()).optional(),
  isSerialized: boolField.optional(),
  images: Joi.any(),
  deletedImages: Joi.array().items(Joi.string()).allow(null),
  faqs: Joi.array().items(Joi.object({
    _id: Joi.string().trim().allow(""),
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required()
  }))
});

module.exports = { productSchema };
