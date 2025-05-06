import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";
export const productTypeValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Product type name is required"),
      "string.min": MESSAGE.custom(
        "Product type name must be at least 2 characters long"
      ),
      "string.max": MESSAGE.custom(
        "Product type name must not exceed 50 characters"
      ),
      "any.required": MESSAGE.custom("Product type name is required"),
    }),
  description: Joi.string()
    .max(200)
    .optional()
    .allow(null, "")
    .messages({
      "string.max": MESSAGE.custom(
        "Description must not exceed 200 characters"
      ),
    }),
});
export const productTypeUpdateValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": MESSAGE.custom(
        "Product type name must be at least 2 characters long"
      ),
      "string.max": MESSAGE.custom(
        "Product type name must not exceed 50 characters"
      ),
    }),
  description: Joi.string()
    .max(200)
    .optional()
    .allow(null, "")
    .messages({
      "string.max": MESSAGE.custom(
        "Description must not exceed 200 characters"
      ),
    }),
});
