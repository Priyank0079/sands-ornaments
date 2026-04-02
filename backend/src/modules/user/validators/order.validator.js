const Joi = require("joi");

const itemSchema = Joi.object({
  productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  variantId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const placeOrderSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required(),
  shippingAddress: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    flatNo: Joi.string().required(),
    area: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().allow(""),
    state: Joi.string().required(),
    pincode: Joi.string().length(6).required(),
  }).required(),
  paymentMethod: Joi.string().valid("razorpay", "cod").required(),
  couponCode: Joi.string().allow("").uppercase(),
});

module.exports = { placeOrderSchema };
