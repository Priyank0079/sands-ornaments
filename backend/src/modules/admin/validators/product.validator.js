const Joi = require("joi");

const variantSchema = Joi.object({
  name: Joi.string().required().trim(),
  mrp: Joi.number().required().min(0),
  price: Joi.number().required().min(0).max(Joi.ref('mrp')),
  stock: Joi.number().integer().required().min(0),
});

const productSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100),
  slug: Joi.string().trim().lowercase(),
  brand: Joi.string().default("SANDS"),
  categories: Joi.array().items(
    Joi.object({
      categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
      subcategoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    })
  ).min(1).required(),
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
    isNewArrival: Joi.boolean(),
    isMostGifted: Joi.boolean(),
    isNewLaunch: Joi.boolean(),
    isTrending: Joi.boolean(),
    isPremium: Joi.boolean(),
  }),
  status: Joi.string().valid("Active", "Draft", "Archived").default("Active"),
  showInNavbar: Joi.boolean(),
  showInCollection: Joi.boolean(),
});

module.exports = { productSchema };
