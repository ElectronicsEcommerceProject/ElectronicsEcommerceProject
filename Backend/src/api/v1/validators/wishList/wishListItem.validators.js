import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validation for creating a wishlist item
export const createWishlistItemValidator = Joi.object({
  wishlist_id: Joi.string().uuid().required().messages({
    "string.empty": MESSAGE.custom("Wishlist ID is required"),
    "string.uuid": MESSAGE.custom("Wishlist ID must be a valid UUID"),
    "any.required": MESSAGE.custom("Wishlist ID is required"),
  }),
  product_id: Joi.string().uuid().required().messages({
    "string.empty": MESSAGE.custom("Product ID is required"),
    "string.uuid": MESSAGE.custom("Product ID must be a valid UUID"),
    "any.required": MESSAGE.custom("Product ID is required"),
  }),
  product_variant_id: Joi.string().uuid().allow(null).optional().messages({
    "string.uuid": MESSAGE.custom("Product variant ID must be a valid UUID"),
  }),
});

// Validation for wishlist item ID
export const wishlistItemIdValidator = Joi.object({
  wish_list_item_id: Joi.string().uuid().required().messages({
    "string.empty": MESSAGE.custom("Wishlist item ID is required"),
    "string.uuid": MESSAGE.custom("Wishlist item ID must be a valid UUID"),
    "any.required": MESSAGE.custom("Wishlist item ID is required"),
  }),
});