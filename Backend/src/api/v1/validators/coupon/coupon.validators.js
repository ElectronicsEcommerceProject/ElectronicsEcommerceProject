import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validation for creating a coupon
export const couponValidator = Joi.object({
  code: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Coupon code is required"),
      "any.required": MESSAGE.custom("Coupon code is required"),
    }),
  description: Joi.string().allow(null, "").optional(),
  type: Joi.string()
    .valid("fixed", "percentage")
    .required()
    .messages({
      "any.only": MESSAGE.custom("Type must be either 'fixed' or 'percentage'"),
      "any.required": MESSAGE.custom("Coupon type is required"),
    }),
  discount_value: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Discount value must be a number"),
      "number.positive": MESSAGE.custom("Discount value must be positive"),
      "any.required": MESSAGE.custom("Discount value is required"),
    }),
  target_type: Joi.string()
    .valid("cart", "product")
    .default("cart")
    .messages({
      "any.only": MESSAGE.custom(
        "Target type must be either 'cart' or 'product'"
      ),
    }),
  product_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  target_role: Joi.string()
    .valid("customer", "retailer", "both")
    .default("both")
    .messages({
      "any.only": MESSAGE.custom(
        "Target role must be one of: customer, retailer, or both"
      ),
    }),
  min_cart_value: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Minimum cart value must be a number"),
      "number.min": MESSAGE.custom("Minimum cart value cannot be negative"),
    }),
  max_discount_value: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Maximum discount value must be a number"),
      "number.min": MESSAGE.custom("Maximum discount value cannot be negative"),
    }),
  usage_limit: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Usage limit must be a number"),
      "number.integer": MESSAGE.custom("Usage limit must be an integer"),
      "number.min": MESSAGE.custom("Usage limit must be at least 1"),
    }),
  usage_per_user: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Usage per user must be a number"),
      "number.integer": MESSAGE.custom("Usage per user must be an integer"),
      "number.min": MESSAGE.custom("Usage per user must be at least 1"),
    }),
  valid_from: Joi.date()
    .required()
    .messages({
      "date.base": MESSAGE.custom("Valid from must be a valid date"),
      "any.required": MESSAGE.custom("Valid from date is required"),
    }),
  valid_to: Joi.date()
    .greater(Joi.ref("valid_from"))
    .required()
    .messages({
      "date.base": MESSAGE.custom("Valid to must be a valid date"),
      "date.greater": MESSAGE.custom(
        "Valid to date must be after valid from date"
      ),
      "any.required": MESSAGE.custom("Valid to date is required"),
    }),
  is_active: Joi.boolean().default(true),
  is_user_new: Joi.boolean().default(false),
});

// Validation for updating a coupon
export const couponUpdateValidator = Joi.object({
  code: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Coupon code cannot be empty if provided"),
    }),
  description: Joi.string().allow(null, "").optional(),
  type: Joi.string()
    .valid("fixed", "percentage")
    .optional()
    .messages({
      "any.only": MESSAGE.custom("Type must be either 'fixed' or 'percentage'"),
    }),
  discount_value: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Discount value must be a number"),
      "number.positive": MESSAGE.custom("Discount value must be positive"),
    }),
  target_type: Joi.string()
    .valid("cart", "product")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Target type must be either 'cart' or 'product'"
      ),
    }),
  product_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  target_role: Joi.string()
    .valid("customer", "retailer", "both")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Target role must be one of: customer, retailer, or both"
      ),
    }),
  min_cart_value: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Minimum cart value must be a number"),
      "number.min": MESSAGE.custom("Minimum cart value cannot be negative"),
    }),
  max_discount_value: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Maximum discount value must be a number"),
      "number.min": MESSAGE.custom("Maximum discount value cannot be negative"),
    }),
  usage_limit: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Usage limit must be a number"),
      "number.integer": MESSAGE.custom("Usage limit must be an integer"),
      "number.min": MESSAGE.custom("Usage limit must be at least 1"),
    }),
  usage_per_user: Joi.number()
    .integer()
    .min(1)
    .allow(null)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Usage per user must be a number"),
      "number.integer": MESSAGE.custom("Usage per user must be an integer"),
      "number.min": MESSAGE.custom("Usage per user must be at least 1"),
    }),
  valid_from: Joi.date()
    .optional()
    .messages({
      "date.base": MESSAGE.custom("Valid from must be a valid date"),
    }),
  valid_to: Joi.date()
    .when("valid_from", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("valid_from")).required(),
      otherwise: Joi.date().optional(),
    })
    .messages({
      "date.base": MESSAGE.custom("Valid to must be a valid date"),
      "date.greater": MESSAGE.custom(
        "Valid to date must be after valid from date"
      ),
    }),
  is_active: Joi.boolean().optional(),
  is_user_new: Joi.boolean().optional(),
});

// Validation for coupon ID
export const couponIdValidator = Joi.object({
  coupon_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Coupon ID is required"),
      "string.uuid": MESSAGE.custom("Coupon ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Coupon ID is required"),
    }),
});
