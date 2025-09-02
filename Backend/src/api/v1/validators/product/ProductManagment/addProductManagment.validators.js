import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";
export const addProductManagementValidator = Joi.object({
  category: Joi.object({
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
    target_role: Joi.string()
      .valid("customer", "retailer", "both")
      .required()
      .messages({
        "any.only": MESSAGE.custom(
          "Target role must be one of: customer, retailer, or both"
        ),
        "any.required": MESSAGE.custom("Target role is required"),
      }),
  }).required(),
  brand: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Brand name is required"),
        "string.min": MESSAGE.custom(
          "Brand name must be at least 2 characters long"
        ),
        "string.max": MESSAGE.custom(
          "Brand name must not exceed 50 characters"
        ),
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
    category_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Category name is required"),
        "any.required": MESSAGE.custom("Category name is required"),
      }),
  }).required(),
  product: Joi.object({
    name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Product name is required"),
        "any.required": MESSAGE.custom("Product name is required"),
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
    base_price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        "number.base": MESSAGE.custom("Base price must be a decimal value"),
        "number.positive": MESSAGE.custom(
          "Base price must be a positive number"
        ),
        "any.required": MESSAGE.custom("Base price is required"),
      }),
    description: Joi.string()
      .optional()
      .allow(null, "")
      .messages({
        "string.empty": MESSAGE.custom(
          "Description cannot be empty if provided"
        ),
      }),
    average_rating: Joi.number()
      .min(0)
      .max(5)
      .precision(1)
      .optional()
      .allow(null)
      .messages({
        "number.min": MESSAGE.custom("Rating average must be between 0 and 5"),
        "number.max": MESSAGE.custom("Rating average must be between 0 and 5"),
      }),
    brand_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Brand name is required"),
        "any.required": MESSAGE.custom("Brand name is required"),
      }),
    category_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Category name is required"),
        "any.required": MESSAGE.custom("Category name is required"),
      }),
  }).required(),
  variant: Joi.object({
    sku: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("SKU is required"),
        "any.required": MESSAGE.custom("SKU is required"),
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        "number.base": MESSAGE.custom("Price must be a decimal value"),
        "number.positive": MESSAGE.custom("Price must be a positive number"),
        "any.required": MESSAGE.custom("Price is required"),
      }),
    description: Joi.string()
      .optional()
      .allow(null, "")
      .messages({
        "string.base": MESSAGE.custom("Description must be a string"),
      }),
    stock_quantity: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": MESSAGE.custom("Stock quantity must be an integer"),
        "number.min": MESSAGE.custom("Stock quantity cannot be negative"),
        "any.required": MESSAGE.custom("Stock quantity is required"),
      }),
    discount_percentage: Joi.number()
      .precision(2)
      .min(0)
      .max(100)
      .optional()
      .allow(null)
      .messages({
        "number.base": MESSAGE.custom(
          "Discount percentage must be a decimal value"
        ),
        "number.min": MESSAGE.custom("Discount percentage cannot be negative"),
        "number.max": MESSAGE.custom("Discount percentage cannot exceed 100"),
      }),
    discount_quantity: Joi.number()
      .integer()
      .min(0)
      .optional()
      .allow(null)
      .messages({
        "number.base": MESSAGE.custom("Discount quantity must be an integer"),
        "number.min": MESSAGE.custom("Discount quantity cannot be negative"),
      }),
    min_retailer_quantity: Joi.number()
      .integer()
      .min(0)
      .optional()
      .allow(null)
      .messages({
        "number.base": MESSAGE.custom(
          "Minimum retailer quantity must be an integer"
        ),
        "number.min": MESSAGE.custom(
          "Minimum retailer quantity cannot be negative"
        ),
      }),
    bulk_discount_percentage: Joi.number()
      .precision(2)
      .min(0)
      .max(100)
      .optional()
      .allow(null)
      .messages({
        "number.base": MESSAGE.custom(
          "Bulk discount percentage must be a decimal value"
        ),
        "number.min": MESSAGE.custom(
          "Bulk discount percentage cannot be negative"
        ),
        "number.max": MESSAGE.custom(
          "Bulk discount percentage cannot exceed 100"
        ),
      }),
    bulk_discount_quantity: Joi.number()
      .integer()
      .min(0)
      .optional()
      .allow(null)
      .messages({
        "number.base": MESSAGE.custom(
          "Bulk discount quantity must be an integer"
        ),
        "number.min": MESSAGE.custom(
          "Bulk discount quantity cannot be negative"
        ),
      }),
    brand_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Brand name is required"),
        "any.required": MESSAGE.custom("Brand name is required"),
      }),
    product_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Product name is required"),
        "any.required": MESSAGE.custom("Product name is required"),
      }),
    category_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Category name is required"),
        "any.required": MESSAGE.custom("Category name is required"),
      }),
  }).required(),
  attributeValue: Joi.object({
    attribute_name: Joi.string()
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
    type: Joi.string()
      .valid("text", "number", "boolean", "enum")
      .required()
      .messages({
        "any.only": MESSAGE.custom(
          "Type must be one of: text, number, boolean, or enum"
        ),
        "any.required": MESSAGE.custom("Type is required"),
      }),
    value: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Value is required"),
        "any.required": MESSAGE.custom("Value is required"),
      }),
    brand_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Brand name is required"),
        "any.required": MESSAGE.custom("Brand name is required"),
      }),
    product_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Product name is required"),
        "any.required": MESSAGE.custom("Product name is required"),
      }),
    category_name: Joi.string()
      .required()
      .messages({
        "string.empty": MESSAGE.custom("Category name is required"),
        "any.required": MESSAGE.custom("Category name is required"),
      }),
  }).required(),
  productMedia: Joi.object({
    media_type: Joi.string()
      .valid("image", "video")
      .default("image")
      .messages({
        "any.only": MESSAGE.custom(
          "productMedia type must be either 'image' or 'video'"
        ),
      }),
    media_file: Joi.object({
      fileName: Joi.string().required(),
      type: Joi.string().required(),
      size: Joi.number().required(),
    })
      .required()
      .messages({
        "any.required": MESSAGE.custom("productMedia file is required"),
      }),
  }).required(),
});
