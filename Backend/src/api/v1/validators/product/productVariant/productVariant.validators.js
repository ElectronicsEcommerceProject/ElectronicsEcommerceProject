import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";

export const productVariantValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
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
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.base": MESSAGE.custom("Stock quantity must be an integer"),
      "number.min": MESSAGE.custom("Stock quantity cannot be negative"),
    }),
  sku: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("SKU must be a string"),
    }),
  variant_image_url: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": MESSAGE.custom("Variant image URL must be a valid URI"),
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
  attribute_values: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .messages({
      "array.base": MESSAGE.custom("Attribute values must be an array"),
      "string.guid": MESSAGE.custom("Attribute value IDs must be valid UUIDs"),
    }),
});

export const productVariantUpdateValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Price must be a decimal value"),
      "number.positive": MESSAGE.custom("Price must be a positive number"),
    }),
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Stock quantity must be an integer"),
      "number.min": MESSAGE.custom("Stock quantity cannot be negative"),
    }),
  sku: Joi.string()
    .optional()
    .allow(null, "")
    .messages({
      "string.base": MESSAGE.custom("SKU must be a string"),
    }),
  variant_image_url: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": MESSAGE.custom("Variant image URL must be a valid URI"),
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
  attribute_values: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .messages({
      "array.base": MESSAGE.custom("Attribute values must be an array"),
      "string.guid": MESSAGE.custom("Attribute value IDs must be valid UUIDs"),
    }),
});

export const variantIdSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Variant ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Variant ID is required"),
    }),
});
