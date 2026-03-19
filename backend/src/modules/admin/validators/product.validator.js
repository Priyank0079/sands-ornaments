const Joi = require("joi");

const boolField = Joi.boolean().truthy("true").falsy("false");

const variantSchema = Joi.object({
  name: Joi.string().required().trim(),
  mrp: Joi.number().required().min(0),
  price: Joi.number().required().min(0).max(Joi.ref('mrp')),
  stock: Joi.number().integer().required().min(0),
  discount: Joi.number().min(0).max(100),
});

const productSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100),
  slug: Joi.string().trim().lowercase(),
  brand: Joi.string().default("SANDS"),
  categories: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).max(1).required(),
  description: Joi.string().required(),
  stylingTips: Joi.string().allow(""),
  material: Joi.string().default("925 Silver"),
  weight: Joi.number().positive(),
  weightUnit: Joi.string().valid("Grams", "Carats", "Milligrams").default("Grams"),
  specifications: Joi.string().allow(""),
  supplierInfo: Joi.string().allow(""),
  cardLabel: Joi.string().allow(""),
  cardBadge: Joi.string().allow(""),
  variants: Joi.array().items(variantSchema).min(1).required(),
  tags: Joi.object({
    isNewArrival: boolField,
    isMostGifted: boolField,
    isNewLaunch: boolField,
    isTrending: boolField,
    isPremium: boolField,
  }),
  status: Joi.string().valid("Active", "Draft", "Archived").default("Active"),
  showInNavbar: boolField,
  showInCollection: boolField,
  active: boolField,
  navGiftsFor: Joi.array().items(Joi.string().trim()).optional(),
  navOccasions: Joi.array().items(Joi.string().trim()).optional(),
  images: Joi.any(),
  deletedImages: Joi.array().items(Joi.string()).allow(null),
  faqs: Joi.array().items(Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required()
  }))
});

module.exports = { productSchema };
