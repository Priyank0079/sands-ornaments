const { error } = require("../utils/apiResponse");

// Usage: validate(schema) where schema is a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error: err } = schema.validate(req.body, { abortEarly: false });
  if (err) {
    const messages = err.details.map((d) => d.message).join(", ");
    return error(res, messages, 400, "VALIDATION_ERROR");
  }
  next();
};

module.exports = validate;
