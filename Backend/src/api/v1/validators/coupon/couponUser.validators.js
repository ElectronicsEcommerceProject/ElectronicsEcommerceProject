import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validation for creating a coupon-user association
export const couponUserValidator = Joi.object({
  coupon_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Coupon ID is required"),
      "string.uuid": MESSAGE.custom("Coupon ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Coupon ID is required"),
    }),
  user_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("User ID is required"),
      "string.uuid": MESSAGE.custom("User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("User ID is required"),
    }),
  category_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.uuid": MESSAGE.custom("Category ID must be a valid UUID"),
    }),
  brand_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.uuid": MESSAGE.custom("Brand ID must be a valid UUID"),
    }),
  product_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.uuid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.uuid": MESSAGE.custom("Product Variant ID must be a valid UUID"),
    }),
});

// Validation for coupon-user ID
export const couponUserIdValidator = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Coupon-User ID is required"),
      "string.uuid": MESSAGE.custom("Coupon-User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Coupon-User ID is required"),
    }),
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

// Validation for user ID
export const userIdValidator = Joi.object({
  user_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("User ID is required"),
      "string.uuid": MESSAGE.custom("User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("User ID is required"),
    }),
});
