const Joi = require("joi");
const errorCodes = require("../untiles/errorCodes");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": errorCodes.REQUIRED_FIELD,
    "string.min": "Tên phải có ít nhất {#limit} ký tự",
    "string.max": "Tên không được vượt quá {#limit} ký tự",
  }),
  email: Joi.string().email().required().messages({
    "string.email": errorCodes.INVALID_EMAIL,
    "string.empty": errorCodes.REQUIRED_FIELD,
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": errorCodes.REQUIRED_FIELD,
    "string.min": errorCodes.PASSWORD_TOO_SHORT,
  }),
  phone: Joi.string()
    .pattern(/^(0\d{9}|\+84\d{9,10})$/)
    .required()
    .messages({
      "string.empty": errorCodes.REQUIRED_FIELD,
      "string.pattern.base": errorCodes.INVALID_PHONE,
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": errorCodes.INVALID_EMAIL,
    "string.empty": errorCodes.REQUIRED_FIELD,
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": errorCodes.REQUIRED_FIELD,
    "string.min": errorCodes.PASSWORD_TOO_SHORT,
  }),
});

module.exports = { registerSchema, loginSchema };
