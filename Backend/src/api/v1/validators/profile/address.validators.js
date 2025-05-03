import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";
export const addressValidator = Joi.object({
  user_id: Joi.string()
    .uuid()
    .optional() // This will be set from the JWT token
    .messages({
      "string.guid": MESSAGE.custom("User ID must be a valid UUID"),
    }),
  status: Joi.string()
    .valid("default", "history")
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Status is required"),
      "any.required": MESSAGE.custom("Status is required"),
      "any.only": MESSAGE.custom(
        "Status must be either 'default' or 'history'"
      ),
    }),
  type: Joi.string()
    .valid("home", "work", "other")
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Address type is required"),
      "any.required": MESSAGE.custom("Address type is required"),
      "any.only": MESSAGE.custom(
        "Address type must be one of: home, work, or other"
      ),
    }),
  address: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Address is required"),
      "any.required": MESSAGE.custom("Address is required"),
    }),
  city: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("City is required"),
      "any.required": MESSAGE.custom("City is required"),
    }),
  postal_code: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Postal code is required"),
      "any.required": MESSAGE.custom("Postal code is required"),
    }),
  nearby: Joi.string()
    .optional()
    .allow(null, "")
    .messages({ "string.base": MESSAGE.custom("Nearby must be a string") }),
  is_active: Joi.boolean()
    .optional()
    .default(true)
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean"),
    }),
});
export const updateAddressValidator = Joi.object({
  status: Joi.string()
    .valid("default", "history")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Status must be either 'default' or 'history'"
      ),
    }),
  type: Joi.string()
    .valid("home", "work", "other")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Address type must be one of: home, work, or other"
      ),
    }),
  address: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Address cannot be empty if provided"),
    }),
  city: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("City cannot be empty if provided"),
    }),
  postal_code: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Postal code cannot be empty if provided"),
    }),
  nearby: Joi.string()
    .optional()
    .allow(null, "")
    .messages({ "string.base": MESSAGE.custom("Nearby must be a string") }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean"),
    }),
});

export const id = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("ID must be a valid UUID"),
      "any.required": MESSAGE.custom("ID is required"),
    }),
});
