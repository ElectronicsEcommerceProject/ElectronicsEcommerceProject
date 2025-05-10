import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validation for creating an order
export const createOrderValidator = Joi.object({
  user_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("User ID is required"),
      "string.uuid": MESSAGE.custom("User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("User ID is required"),
    }),
  address_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Address ID is required"),
      "string.uuid": MESSAGE.custom("Address ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Address ID is required"),
    }),
  payment_method: Joi.string()
    .valid("credit_card", "debit_card", "upi", "cod", "net_banking")
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Payment method is required"),
      "any.only": MESSAGE.custom("Invalid payment method"),
      "any.required": MESSAGE.custom("Payment method is required"),
    }),
  subtotal: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Subtotal must be a number"),
      "number.positive": MESSAGE.custom("Subtotal must be positive"),
      "any.required": MESSAGE.custom("Subtotal is required"),
    }),
  shipping_cost: Joi.number()
    .min(0)
    .precision(2)
    .default(0.0)
    .messages({
      "number.base": MESSAGE.custom("Shipping cost must be a number"),
      "number.min": MESSAGE.custom("Shipping cost cannot be negative"),
    }),
  tax_amount: Joi.number()
    .min(0)
    .precision(2)
    .default(0.0)
    .messages({
      "number.base": MESSAGE.custom("Tax amount must be a number"),
      "number.min": MESSAGE.custom("Tax amount cannot be negative"),
    }),
  discount_amount: Joi.number()
    .min(0)
    .precision(2)
    .default(0.0)
    .messages({
      "number.base": MESSAGE.custom("Discount amount must be a number"),
      "number.min": MESSAGE.custom("Discount amount cannot be negative"),
    }),
  total_amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Total amount must be a number"),
      "number.positive": MESSAGE.custom("Total amount must be positive"),
      "any.required": MESSAGE.custom("Total amount is required"),
    }),
  notes: Joi.string().allow(null, "").optional(),
});

// Validation for updating an order
export const updateOrderValidator = Joi.object({
  order_status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .messages({
      "any.only": MESSAGE.custom("Invalid order status"),
    }),
  payment_status: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .messages({
      "any.only": MESSAGE.custom("Invalid payment status"),
    }),
  tracking_number: Joi.string().allow(null, "").optional(),
  notes: Joi.string().allow(null, "").optional(),
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
