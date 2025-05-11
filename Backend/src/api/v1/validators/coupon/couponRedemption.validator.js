import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validation for creating a coupon redemption
export const couponRedemptionValidator = Joi.object({
  user_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("User ID is required"),
      "string.uuid": MESSAGE.custom("User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("User ID is required"),
    }),
  coupon_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Coupon ID is required"),
      "string.uuid": MESSAGE.custom("Coupon ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Coupon ID is required"),
    }),
  order_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Order ID is required"),
      "string.uuid": MESSAGE.custom("Order ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Order ID is required"),
    }),
  discount_amount: Joi.number()
    .precision(2)
    .positive()
    .required()
    .messages({
      "number.base": MESSAGE.custom("Discount amount must be a number"),
      "number.positive": MESSAGE.custom("Discount amount must be positive"),
      "any.required": MESSAGE.custom("Discount amount is required"),
    }),
});

// Validation for coupon redemption ID
export const couponRedemptionIdValidator = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Redemption ID is required"),
      "string.uuid": MESSAGE.custom("Redemption ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Redemption ID is required"),
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

// Validation for order ID
export const orderIdValidator = Joi.object({
  order_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Order ID is required"),
      "string.uuid": MESSAGE.custom("Order ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Order ID is required"),
    }),
});
