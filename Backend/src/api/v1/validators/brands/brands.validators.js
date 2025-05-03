import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";
export const brandValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Brand name is required"),
      "string.min": MESSAGE.custom(
        "Brand name must be at least 2 characters long"
      ),
      "string.max": MESSAGE.custom("Brand name must not exceed 50 characters"),
      "any.required": MESSAGE.custom("Brand name is required"),
    }),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Slug is required"),
      "string.pattern.base": MESSAGE.custom(
        "Slug must be a valid URL-friendly string"
      ),
      "any.required": MESSAGE.custom("Slug is required"),
    }),
});
export const brandUpdateValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": MESSAGE.custom(
        "Brand name must be at least 2 characters long"
      ),
      "string.max": MESSAGE.custom("Brand name must not exceed 50 characters"),
    }),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .messages({
      "string.pattern.base": MESSAGE.custom(
        "Slug must be a valid URL-friendly string"
      ),
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
