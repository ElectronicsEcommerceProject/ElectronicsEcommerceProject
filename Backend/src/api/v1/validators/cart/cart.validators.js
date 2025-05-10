import Joi from "joi";

// Validation for creating a cart
export const createCartValidator = Joi.object({
  user_id: Joi.string().uuid().required().messages({
    "string.empty": "User ID is required.",
    "string.uuid": "User ID must be a valid UUID.",
    "any.required": "User ID is required.",
  }),
});

// Validation for cart ID
export const cartIdValidator = Joi.object({
  cart_id: Joi.string().uuid().required().messages({
    "string.empty": "Cart ID is required.",
    "string.uuid": "Cart ID must be a valid UUID.",
    "any.required": "Cart ID is required.",
  }),
});

// Validation for user ID
export const userIdValidator = Joi.object({
  user_id: Joi.string().uuid().required().messages({
    "string.empty": "User ID is required.",
    "string.uuid": "User ID must be a valid UUID.",
    "any.required": "User ID is required.",
  }),
});
