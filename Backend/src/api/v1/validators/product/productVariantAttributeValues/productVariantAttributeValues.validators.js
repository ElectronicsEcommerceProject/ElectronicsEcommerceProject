import Joi from "joi";
import MESSAGE from "../../../../../constants/message.js";
export const variantAttributeValueValidator = Joi.object({
  product_variant_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Product variant ID is required"),
    }),
  product_attribute_value_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom(
        "Product attribute value ID must be a valid UUID"
      ),
      "any.required": MESSAGE.custom("Product attribute value ID is required"),
    }),
});

export const variantAttributeValueUpdateValidator = Joi.object({
  product_variant_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom("Product variant ID must be a valid UUID"),
    }),
  product_attribute_value_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": MESSAGE.custom(
        "Product attribute value ID must be a valid UUID"
      ),
    }),
});
