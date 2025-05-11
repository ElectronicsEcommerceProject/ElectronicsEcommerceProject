import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";

export const createReviewValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Rating must be a number"),
      "number.integer": MESSAGE.custom("Rating must be an integer"),
      "number.min": MESSAGE.custom("Rating must be at least 1"),
      "number.max": MESSAGE.custom("Rating cannot exceed 5"),
      "any.required": MESSAGE.custom("Rating is required"),
    }),
  title: Joi.string()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Title cannot exceed 255 characters"),
    }),
  review: Joi.string()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": MESSAGE.custom("Review must be a string"),
    }),
  is_verified_purchase: Joi.boolean()
    .optional()
    .default(false)
    .messages({
      "boolean.base": MESSAGE.custom(
        "Is verified purchase must be a boolean value"
      ),
    }),
});

export const updateReviewValidator = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Rating must be a number"),
      "number.integer": MESSAGE.custom("Rating must be an integer"),
      "number.min": MESSAGE.custom("Rating must be at least 1"),
      "number.max": MESSAGE.custom("Rating cannot exceed 5"),
    }),
  title: Joi.string()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Title cannot exceed 255 characters"),
    }),
  review: Joi.string()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": MESSAGE.custom("Review must be a string"),
    }),
});

export const productIdValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
    }),
});

export const reviewIdValidator = Joi.object({
  review_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Review ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Review ID is required"),
    }),
});
