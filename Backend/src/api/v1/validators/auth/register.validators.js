import Joi from "joi";

import { ROLES } from "../../../../constants/roles/roles.js";

export const registerValidator = Joi.object({
  name: Joi.string()
    .min(1) // Name must have at least 1 character
    .required()
    .messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validates email format
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10}$/) // Validates a 10-digit phone number
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit number",
      "any.required": "Phone number is required",
    }),
  password: Joi.string()
    .min(6) // Password must be at least 6 characters long
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  address: Joi.string()
    .optional()
    .allow(null, "") // Address is optional and can be null or empty
    .messages({
      "string.base": "Address must be a string",
    }),
  city: Joi.string()
    .optional()
    .allow(null, "") // City is optional and can be null or empty
    .messages({
      "string.base": "City must be a string",
    }),
  postal_code: Joi.string()
    .optional()
    .allow(null, "") // Postal code is optional and can be null or empty
    .messages({
      "string.base": "Postal code must be a string",
    }),
  profileImage_url: Joi.string()
    .uri() // Validates a valid URL format
    .optional()
    .allow(null, "") // Profile image URL is optional and can be null or empty
    .messages({
      "string.uri": "Profile image URL must be a valid URI",
    }),
  role: Joi.string()
    .valid(...Object.values(ROLES)) // Role must be one of the predefined roles
    .required()
    .messages({
      "any.only": `Role must be one of ${Object.values(ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
});