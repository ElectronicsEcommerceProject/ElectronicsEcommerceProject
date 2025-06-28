import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";
export const addressValidator = Joi.object({
  user_id: Joi.string()
    .uuid()
    .optional() // This will be set from the JWT token
    .messages({
      "string.guid": MESSAGE.custom("User ID must be a valid UUID"),
    }),
  address_line1: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Address line 1 is required"),
      "any.required": MESSAGE.custom("Address line 1 is required"),
    }),
  address_line2: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("Address line 2 must be a string"),
    }),
  city: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("City is required"),
      "any.required": MESSAGE.custom("City is required"),
    }),
  state: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("State is required"),
      "any.required": MESSAGE.custom("State is required"),
    }),
  postal_code: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Postal code is required"),
      "any.required": MESSAGE.custom("Postal code is required"),
    }),
  country: Joi.string()
    .optional()
    .default("India")
    .messages({
      "string.base": MESSAGE.custom("Country must be a string"),
    }),
  latitude: Joi.number()
    .optional()
    .allow(null)
    .min(-90)
    .max(90)
    .messages({
      "number.base": MESSAGE.custom("Latitude must be a number"),
      "number.min": MESSAGE.custom("Latitude must be between -90 and 90"),
      "number.max": MESSAGE.custom("Latitude must be between -90 and 90"),
    }),
  longitude: Joi.number()
    .optional()
    .allow(null)
    .min(-180)
    .max(180)
    .messages({
      "number.base": MESSAGE.custom("Longitude must be a number"),
      "number.min": MESSAGE.custom("Longitude must be between -180 and 180"),
      "number.max": MESSAGE.custom("Longitude must be between -180 and 180"),
    }),
  is_default: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      "boolean.base": MESSAGE.custom("Is default must be a boolean"),
    }),
  is_active: Joi.boolean()
    .optional()
    .default(true)
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean"),
    }),
});
export const updateAddressValidator = Joi.object({
  address_line1: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom(
        "Address line 1 cannot be empty if provided"
      ),
    }),
  address_line2: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("Address line 2 must be a string"),
    }),
  city: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("City cannot be empty if provided"),
    }),
  state: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("State cannot be empty if provided"),
    }),
  postal_code: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Postal code cannot be empty if provided"),
    }),
  country: Joi.string()
    .optional()
    .messages({
      "string.base": MESSAGE.custom("Country must be a string"),
    }),
  latitude: Joi.number()
    .optional()
    .allow(null)
    .min(-90)
    .max(90)
    .messages({
      "number.base": MESSAGE.custom("Latitude must be a number"),
      "number.min": MESSAGE.custom("Latitude must be between -90 and 90"),
      "number.max": MESSAGE.custom("Latitude must be between -90 and 90"),
    }),
  longitude: Joi.number()
    .optional()
    .allow(null)
    .min(-180)
    .max(180)
    .messages({
      "number.base": MESSAGE.custom("Longitude must be a number"),
      "number.min": MESSAGE.custom("Longitude must be between -180 and 180"),
      "number.max": MESSAGE.custom("Longitude must be between -180 and 180"),
    }),
  is_default: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is default must be a boolean"),
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean"),
    }),
});

export const address_id = Joi.object({
  address_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("ID must be a valid UUID"),
      "any.required": MESSAGE.custom("ID is required"),
    }),
});
