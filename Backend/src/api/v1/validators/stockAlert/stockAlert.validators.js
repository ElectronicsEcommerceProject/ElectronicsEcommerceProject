import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

export const stockAlertValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product variant ID is required"),
    }),
  stock_level: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": MESSAGE.custom("Stock level must be a number"),
      "number.integer": MESSAGE.custom("Stock level must be an integer"),
      "number.min": MESSAGE.custom("Stock level cannot be negative"),
      "any.required": MESSAGE.custom("Stock level is required"),
    }),
  status: Joi.string()
    .valid("pending", "sent")
    .default("pending")
    .messages({
      "any.only": MESSAGE.custom("Status must be either 'pending' or 'sent'"),
    }),
});

export const stockAlertUpdateValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  stock_level: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Stock level must be a number"),
      "number.integer": MESSAGE.custom("Stock level must be an integer"),
      "number.min": MESSAGE.custom("Stock level cannot be negative"),
    }),
  status: Joi.string()
    .valid("pending", "sent")
    .optional()
    .messages({
      "any.only": MESSAGE.custom("Status must be either 'pending' or 'sent'"),
    }),
});

export const alertId = Joi.object({
  alert_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Alert ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Alert ID is required"),
    }),
});
