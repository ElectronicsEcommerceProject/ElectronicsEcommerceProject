import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";
export const attributeValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Attribute name is required"),
      "string.min": MESSAGE.custom(
        "Attribute name must be at least 2 characters long"
      ),
      "string.max": MESSAGE.custom(
        "Attribute name must not exceed 50 characters"
      ),
      "any.required": MESSAGE.custom("Attribute name is required"),
    }),
  data_type: Joi.string()
    .valid("string", "int", "float", "enum")
    .required()
    .messages({
      "any.only": MESSAGE.custom(
        "Data type must be one of: string, int, float, or enum"
      ),
      "any.required": MESSAGE.custom("Data type is required"),
    }),
  is_variant_level: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": MESSAGE.custom("Is variant level must be a boolean"),
    }),
});
export const attributeUpdateValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": MESSAGE.custom(
        "Attribute name must be at least 2 characters long"
      ),
      "string.max": MESSAGE.custom(
        "Attribute name must not exceed 50 characters"
      ),
    }),
  data_type: Joi.string()
    .valid("string", "int", "float", "enum")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Data type must be one of: string, int, float, or enum"
      ),
    }),
  is_variant_level: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is variant level must be a boolean"),
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
