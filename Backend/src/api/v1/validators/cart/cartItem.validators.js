import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validation for creating a cart item
export const createCartItemValidator = Joi.object({
  cart_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Cart ID is required"),
      "string.uuid": MESSAGE.custom("Cart ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Cart ID is required"),
    }),
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Product ID is required"),
      "string.uuid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .allow(null)
    .optional()
    .messages({
      "string.uuid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  total_quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Quantity must be a number"),
      "number.integer": MESSAGE.custom("Quantity must be an integer"),
      "number.min": MESSAGE.custom("Quantity must be at least 1"),
      "any.required": MESSAGE.custom("Quantity is required"),
    }),
  price_at_time: Joi.number()
    .precision(2)
    .positive()
    .required()
    .messages({
      "number.base": MESSAGE.custom("Price must be a number"),
      "number.positive": MESSAGE.custom("Price must be positive"),
      "any.required": MESSAGE.custom("Price is required"),
    }),
  final_price: Joi.number()
    .precision(2)
    .positive()
    .required()
    .messages({
      "number.base": MESSAGE.custom("Final price must be a number"),
      "number.positive": MESSAGE.custom("Final price must be positive"),
      "any.required": MESSAGE.custom("Final price is required"),
    }),
  discount_quantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      "number.base": MESSAGE.custom("Discount quantity must be a number"),
      "number.integer": MESSAGE.custom("Discount quantity must be an integer"),
      "number.min": MESSAGE.custom("Discount quantity cannot be negative"),
    }),
  discount_applied: Joi.number()
    .precision(2)
    .min(0)
    .optional()
    .allow(null)
    .messages({
      "number.base": MESSAGE.custom("Discount applied must be a number"),
      "number.min": MESSAGE.custom("Discount applied cannot be negative"),
    }),
  discount_type: Joi.string()
    .valid("fixed", "percentage")
    .optional()
    .allow(null)
    .messages({
      "string.base": MESSAGE.custom("Discount type must be a string"),
      "any.only": MESSAGE.custom(
        "Discount type must be either 'fixed' or 'percentage'"
      ),
    }),
});

// Validation for updating a cart item
export const updateCartItemValidator = Joi.object({
  total_quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Quantity must be a number"),
      "number.integer": MESSAGE.custom("Quantity must be an integer"),
      "number.min": MESSAGE.custom("Quantity must be at least 1"),
      "any.required": MESSAGE.custom("Quantity is required"),
    }),
});

// Validation for cart item ID
export const cartItemIdValidator = Joi.object({
  cart_item_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Cart item ID is required"),
      "string.uuid": MESSAGE.custom("Cart item ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Cart item ID is required"),
    }),
});
