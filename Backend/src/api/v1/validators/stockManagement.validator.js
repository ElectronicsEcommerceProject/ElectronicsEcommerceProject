import Joi from "joi";

// UUID validation pattern
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validator for updating product variant stock
 * Validates both the variant_id parameter and stock_quantity in body
 */
export const updateStockValidator = Joi.object({
  // Validate params
  variant_id: Joi.string()
    .pattern(uuidPattern)
    .required()
    .messages({
      'string.pattern.base': 'variant_id must be a valid UUID',
      'any.required': 'variant_id is required'
    }),
  
  // Validate body
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .required()
    .messages({
      'number.base': 'stock_quantity must be a number',
      'number.integer': 'stock_quantity must be an integer',
      'number.min': 'stock_quantity cannot be negative',
      'number.max': 'stock_quantity cannot exceed 999,999',
      'any.required': 'stock_quantity is required'
    })
});

/**
 * Validator for variant ID parameter only
 */
export const variantIdValidator = Joi.object({
  variant_id: Joi.string()
    .pattern(uuidPattern)
    .required()
    .messages({
      'string.pattern.base': 'variant_id must be a valid UUID',
      'any.required': 'variant_id is required'
    })
});

export default {
  updateStockValidator,
  variantIdValidator
};
