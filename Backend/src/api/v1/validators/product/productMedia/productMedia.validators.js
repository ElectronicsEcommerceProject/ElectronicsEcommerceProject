import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";
export const productMediaValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product ID is required"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .optional()
    .allow(null)
    .messages({
      "string.guid": MESSAGE.custom("Variant ID must be a valid UUID"),
    }),
  media_type: Joi.string()
    .valid("image", "video")
    .default("image")
    .messages({
      "any.only": MESSAGE.custom(
        "Media type must be either 'image' or 'video'"
      ),
    }),
});

export const productMediaUpdateValidator = Joi.object({
  product_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product ID must be a valid UUID"),
    }),
  product_variant_id: Joi.string()
    .uuid()
    .optional()
    .allow(null)
    .messages({
      "string.guid": MESSAGE.custom("Variant ID must be a valid UUID"),
    }),
  media_type: Joi.string()
    .valid("image", "video")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "Media type must be either 'image' or 'video'"
      ),
    }),
});
export const id = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("ID must be a valid UUID"),
      "any.required": MESSAGE.custom("ID is required"),
    }),
});
