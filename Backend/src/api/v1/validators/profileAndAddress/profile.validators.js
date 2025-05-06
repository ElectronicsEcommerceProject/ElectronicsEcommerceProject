import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

export const profileValidator = Joi.object({
  name: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Name is required"),
      "any.required": MESSAGE.custom("Name is required"),
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": MESSAGE.custom("Invalid email format"),
      "any.required": MESSAGE.custom("Email is required"),
    }),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": MESSAGE.custom("Phone number must be a valid 10-digit number"),
      "any.required": MESSAGE.custom("Phone number is required"),
    }),
  profileImage_url: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": MESSAGE.custom("Profile image URL must be a valid URI"),
    }),
  address: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("Address must be a string"),
    }),
  city: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("City must be a string"),
    }),
  postal_code: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("Postal code must be a string"),
    }),
});