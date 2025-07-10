import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

export const bannerValidator = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Banner title is required"),
      "string.min": MESSAGE.custom("Banner title must be at least 3 characters long"),
      "string.max": MESSAGE.custom("Banner title must not exceed 100 characters"),
      "any.required": MESSAGE.custom("Banner title is required"),
    }),
  description: Joi.string()
    .max(500)
    .allow("")
    .messages({
      "string.max": MESSAGE.custom("Description must not exceed 500 characters"),
    }),
  price: Joi.string()
    .max(50)
    .allow("")
    .messages({
      "string.max": MESSAGE.custom("Price must not exceed 50 characters"),
    }),
  discount: Joi.string()
    .max(50)
    .allow("")
    .messages({
      "string.max": MESSAGE.custom("Discount must not exceed 50 characters"),
    }),
  bg_class: Joi.string()
    .max(200)
    .messages({
      "string.max": MESSAGE.custom("Background class must not exceed 200 characters"),
    }),
  button_text: Joi.string()
    .max(30)
    .allow("")
    .messages({
      "string.max": MESSAGE.custom("Button text must not exceed 30 characters"),
    }),
  is_active: Joi.boolean()
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean value"),
    }),
  display_order: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": MESSAGE.custom("Display order must be a number"),
      "number.integer": MESSAGE.custom("Display order must be an integer"),
      "number.min": MESSAGE.custom("Display order must be 0 or greater"),
    }),
});

export const bannerUpdateValidator = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      "string.min": MESSAGE.custom("Banner title must be at least 3 characters long"),
      "string.max": MESSAGE.custom("Banner title must not exceed 100 characters"),
    }),
  description: Joi.string()
    .max(500)
    .allow("")
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Description must not exceed 500 characters"),
    }),
  price: Joi.string()
    .max(50)
    .allow("")
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Price must not exceed 50 characters"),
    }),
  discount: Joi.string()
    .max(50)
    .allow("")
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Discount must not exceed 50 characters"),
    }),
  bg_class: Joi.string()
    .max(200)
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Background class must not exceed 200 characters"),
    }),
  button_text: Joi.string()
    .max(30)
    .allow("")
    .optional()
    .messages({
      "string.max": MESSAGE.custom("Button text must not exceed 30 characters"),
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is active must be a boolean value"),
    }),
  display_order: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": MESSAGE.custom("Display order must be a number"),
      "number.integer": MESSAGE.custom("Display order must be an integer"),
      "number.min": MESSAGE.custom("Display order must be 0 or greater"),
    }),
});

export const banner_id = Joi.object({
  banner_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Banner ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Banner ID is required"),
    }),
});