import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

export const categoryValidator = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Category name is required"),
      "string.min": MESSAGE.custom(
        "Category name must be at least 3 characters long"
      ),
      "string.max": MESSAGE.custom(
        "Category name must not exceed 50 characters"
      ),
      "any.required": MESSAGE.custom("Category name is required"),
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
  parent_id: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      "string.guid": MESSAGE.custom("Parent ID must be a valid UUID"),
    }),
  target_role: Joi.string()
    .valid("customer", "retailer", "both")
    .required()
    .messages({
      "any.only": MESSAGE.custom(
        "Target role must be one of 'customer', 'retailer', or 'both'"
      ),
      "any.required": MESSAGE.custom("Target role is required"),
    }),
});

export const categoryUpdateValidator = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      "string.min": MESSAGE.custom(
        "Category name must be at least 3 characters long"
      ),
      "string.max": MESSAGE.custom(
        "Category name must not exceed 50 characters"
      ),
    }),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .messages({
      "string.pattern.base": MESSAGE.custom(
        "Slug must be a valid URL-friendly string"
      ),
    }),
  parent_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Parent ID must be a valid UUID"),
    }),
  target_role: Joi.string()
    .valid("customer", "retailer", "both")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Target role must be one of 'customer', 'retailer', or 'both'"
      ),
    }),
});
