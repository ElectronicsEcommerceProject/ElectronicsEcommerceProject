import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";

// For productMediaUrl model
export const productMediaUrlValidator = Joi.object({
  product_media_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product productMedia ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product productMedia ID is required"),
    }),
  product_media_url: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("productMedia URL is required"),
      "any.required": MESSAGE.custom("productMedia URL is required"),
    }),
  media_type: Joi.string()
    .valid("image", "video")
    .default("image")
    .messages({
      "any.only": MESSAGE.custom(
        "productMedia type must be either 'image' or 'video'"
      ),
    }),
});

export const productMediaUrlUpdateValidator = Joi.object({
  product_media_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product productMedia ID must be a valid UUID"),
    }),
  product_media_url: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("productMedia URL cannot be empty if provided"),
    }),
  media_type: Joi.string()
    .valid("image", "video")
    .optional()
    .messages({
      "any.only": MESSAGE.custom(
        "productMedia type must be either 'image' or 'video'"
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

export const mediaId = Joi.object({
  mediaId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("productMedia ID must be a valid UUID"),
      "any.required": MESSAGE.custom("productMedia ID is required"),
    }),
});
