import Joi from "joi";

// Validation for creating a wishlist
export const createWishlistValidator = Joi.object({
  user_id: Joi.string().uuid().required().messages({
    "string.empty": "User ID is required.",
    "string.uuid": "User ID must be a valid UUID.",
    "any.required": "User ID is required.",
  }),
});

// Validation for wishlist ID
export const wishlistIdValidator = Joi.object({
  wishlist_id: Joi.string().uuid().required().messages({
    "string.empty": "Wishlist ID is required.",
    "string.uuid": "Wishlist ID must be a valid UUID.",
    "any.required": "Wishlist ID is required.",
  }),
});
