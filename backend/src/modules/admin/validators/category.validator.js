const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  slug: Joi.string().trim().lowercase(),
  description: Joi.string().allow("").max(500),
  showInNavbar: Joi.boolean(),
  showInCollection: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
  metal: Joi.string().trim().allow(""),
  image: Joi.string().trim().allow(""),
  isActive: Joi.boolean(),
});

const subcategorySchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  slug: Joi.string().trim().lowercase(),
  parentCategory: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/), // bson ObjectId validation
  image: Joi.string().trim().allow(""),
  isActive: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
});

module.exports = { categorySchema, subcategorySchema };
