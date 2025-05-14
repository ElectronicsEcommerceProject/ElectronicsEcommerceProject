import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

export const discountRuleValidator = Joi.object({
  rule_type: Joi.string()
    .valid("bulk", "percentage", "quantity", "retailer")
    .required()
    .messages({
      "any.only": MESSAGE.custom(
        "Rule type must be one of: bulk, percentage, quantity, or retailer"
      ),
      "any.required": MESSAGE.custom("Rule type is required"),
    }),
  product_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  category_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Category ID must be a valid UUID"),
    }),
  brand_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Brand ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  min_retailer_quantity: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom(
        "Minimum retailer quantity must be a number"
      ),
      "number.integer": MESSAGE.custom(
        "Minimum retailer quantity must be an integer"
      ),
      "number.min": MESSAGE.custom(
        "Minimum retailer quantity must be at least 1"
      ),
    }),
  bulk_discount_quantity: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Bulk discount quantity must be a number"),
      "number.integer": MESSAGE.custom(
        "Bulk discount quantity must be an integer"
      ),
      "number.min": MESSAGE.custom("Bulk discount quantity must be at least 1"),
    }),
  bulk_discount_percentage: Joi.number()
    .precision(2)
    .min(0)
    .max(100)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom(
        "Bulk discount percentage must be a number"
      ),
      "number.min": MESSAGE.custom(
        "Bulk discount percentage cannot be negative"
      ),
      "number.max": MESSAGE.custom(
        "Bulk discount percentage cannot exceed 100"
      ),
    }),
  discount_quantity: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Discount quantity must be a number"),
      "number.integer": MESSAGE.custom("Discount quantity must be an integer"),
      "number.min": MESSAGE.custom("Discount quantity must be at least 1"),
    }),
  discount_percentage: Joi.number()
    .precision(2)
    .min(0)
    .max(100)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Discount percentage must be a number"),
      "number.min": MESSAGE.custom("Discount percentage cannot be negative"),
      "number.max": MESSAGE.custom("Discount percentage cannot exceed 100"),
    }),
  is_active: Joi.boolean()
    .optional()
    .default(true)
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean value"),
    }),
});

export const discountRuleUpdateValidator = Joi.object({
  rule_type: Joi.string()
    .valid("bulk", "percentage", "quantity", "retailer")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Rule type must be one of: bulk, percentage, quantity, or retailer"
      ),
    }),
  product_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  category_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Category ID must be a valid UUID"),
    }),
  brand_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Brand ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  min_retailer_quantity: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom(
        "Minimum retailer quantity must be a number"
      ),
      "number.integer": MESSAGE.custom(
        "Minimum retailer quantity must be an integer"
      ),
      "number.min": MESSAGE.custom(
        "Minimum retailer quantity must be at least 1"
      ),
    }),
  bulk_discount_quantity: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Bulk discount quantity must be a number"),
      "number.integer": MESSAGE.custom(
        "Bulk discount quantity must be an integer"
      ),
      "number.min": MESSAGE.custom("Bulk discount quantity must be at least 1"),
    }),
  bulk_discount_percentage: Joi.number()
    .precision(2)
    .min(0)
    .max(100)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom(
        "Bulk discount percentage must be a number"
      ),
      "number.min": MESSAGE.custom(
        "Bulk discount percentage cannot be negative"
      ),
      "number.max": MESSAGE.custom(
        "Bulk discount percentage cannot exceed 100"
      ),
    }),
  discount_quantity: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Discount quantity must be a number"),
      "number.integer": MESSAGE.custom("Discount quantity must be an integer"),
      "number.min": MESSAGE.custom("Discount quantity must be at least 1"),
    }),
  discount_percentage: Joi.number()
    .precision(2)
    .min(0)
    .max(100)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Discount percentage must be a number"),
      "number.min": MESSAGE.custom("Discount percentage cannot be negative"),
      "number.max": MESSAGE.custom("Discount percentage cannot exceed 100"),
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean value"),
    }),
});

export const discountRuleIdValidator = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Discount rule ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Discount rule ID is required"),
    }),
});
