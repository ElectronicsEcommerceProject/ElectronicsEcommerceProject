import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";
export const attributeValueValidator = Joi.object({
  attribute_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Attribute ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Attribute ID is required"),
    }),
  value: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Value is required"),
      "any.required": MESSAGE.custom("Value is required"),
    }),
});
export const attributeValueUpdateValidator = Joi.object({
  attribute_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Attribute ID must be a valid UUID"),
    }),
  value: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Value cannot be empty if provided"),
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
