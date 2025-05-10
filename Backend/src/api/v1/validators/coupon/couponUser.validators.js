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
