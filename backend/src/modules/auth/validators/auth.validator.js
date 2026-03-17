const Joi = require("joi");

exports.sendOtpSchema = Joi.object({
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
    "string.length": "Phone number must be exactly 10 digits",
    "string.pattern.base": "Phone number must contain only digits",
  }),
});

exports.verifyOtpSchema = Joi.object({
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  otp: Joi.string().length(4).required(),
});

exports.adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.sellerRegisterSchema = Joi.object({
  shopName: Joi.string().min(3).max(100).required(),
  fullName: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(6).required(),
});

exports.sellerLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
