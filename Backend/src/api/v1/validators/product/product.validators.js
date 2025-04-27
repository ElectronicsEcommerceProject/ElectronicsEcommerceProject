import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Price must be a decimal value',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock must be a non-negative integer',
    'number.min': 'Stock must be a non-negative integer',
  }),
  image_url: Joi.string().uri().optional().messages({
    'string.uri': 'Image URL must be valid',
  }),
  discount_quantity: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Discount quantity must be at least 1',
  }),
  discount_percentage: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Discount percentage must be between 0 and 100',
    'number.max': 'Discount percentage must be between 0 and 100',
  }),
  min_retailer_quantity: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Min retailer quantity must be at least 1',
  }),
  bulk_discount_quantity: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Bulk discount quantity must be at least 1',
  }),
  bulk_discount_percentage: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Bulk discount percentage must be between 0 and 100',
    'number.max': 'Bulk discount percentage must be between 0 and 100',
  }),
  stock_alert_threshold: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Stock alert threshold must be a non-negative integer',
  }),
  target_role: Joi.string()
    .valid('customer', 'retailer', 'both')
    .required()
    .messages({
      'any.only': 'Target role must be one of: customer, retailer, or both',
      'any.required': 'Target role is required',
    }),
  category_id: Joi.number().integer().required().messages({
    'any.required': 'Category ID is required',
  }),
});