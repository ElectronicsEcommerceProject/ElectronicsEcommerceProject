import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

export const productValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Product name is required"),
      "any.required": MESSAGE.custom("Product name is required"),
    }),
  slug: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.empty": MESSAGE.custom("Slug cannot be empty if provided"),
    }),
  description: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.empty": MESSAGE.custom("Description cannot be empty if provided"),
    }),
  short_description: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.empty": MESSAGE.custom(
        "Short description cannot be empty if provided"
      ),
    }),
  base_price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Base price must be a decimal value"),
      "number.positive": MESSAGE.custom("Base price must be a positive number"),
      "any.required": MESSAGE.custom("Base price is required"),
    }),
  rating_average: Joi.number()
    .min(0)
    .max(5)
    .precision(1)
    .optional()
    .allow(null)
    .messages({
      "number.min": MESSAGE.custom("Rating average must be between 0 and 5"),
      "number.max": MESSAGE.custom("Rating average must be between 0 and 5"),
    }),
  rating_count: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      "number.base": MESSAGE.custom(
        "Rating count must be a non-negative integer"
      ),
      "number.min": MESSAGE.custom(
        "Rating count must be a non-negative integer"
      ),
    }),
  is_active: Joi.boolean()
    .optional()
    .default(true)
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean value"),
    }),
  is_featured: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      "boolean.base": MESSAGE.custom("Is featured must be a boolean value"),
    }),
  category_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Category ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Category ID is required"),
    }),
  brand_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Brand ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Brand ID is required"),
    }),
});

export const productUpdateValidationSchema = Joi.object({
  name: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom(
        "Product name cannot be empty if provided"
      ),
    }),
  slug: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.empty": MESSAGE.custom("Slug cannot be empty if provided"),
    }),
  description: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.empty": MESSAGE.custom("Description cannot be empty if provided"),
    }),
  short_description: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.empty": MESSAGE.custom(
        "Short description cannot be empty if provided"
      ),
    }),
  base_price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Base price must be a decimal value"),
      "number.positive": MESSAGE.custom("Base price must be a positive number"),
    }),
  rating_average: Joi.number()
    .min(0)
    .max(5)
    .precision(1)
    .optional()
    .allow(null)
    .messages({
      "number.min": MESSAGE.custom("Rating average must be between 0 and 5"),
      "number.max": MESSAGE.custom("Rating average must be between 0 and 5"),
    }),
  rating_count: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      "number.base": MESSAGE.custom(
        "Rating count must be a non-negative integer"
      ),
      "number.min": MESSAGE.custom(
        "Rating count must be a non-negative integer"
      ),
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean value"),
    }),
  is_featured: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is featured must be a boolean value"),
    }),
  category_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Category ID must be a valid UUID"),
    }),
  brand_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Brand ID must be a valid UUID"),
    }),
});

export const productIdSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
    }),
});
