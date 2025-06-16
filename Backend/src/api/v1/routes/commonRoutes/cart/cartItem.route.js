import express from "express";
import { validator } from "../../../../../middleware/index.js";
import { verifyJwtToken } from "../../../../../middleware/jwt.middleware.js";
import { cartItemController } from "../../../controllers/index.js";
import { validators } from "../../../validators/index.js";

const router = express.Router();

// Add item to cart
router.post(
  "/",
  verifyJwtToken,
  validator(validators.cartItem.createCartItem, null),
  cartItemController.addItemToCart
);

// FindOrCreate cart item - for BuyNowPage
router.post(
  "/findOrCreate",
  verifyJwtToken,
  validator(validators.cartItem.createCartItem, null),
  cartItemController.findOrCreateCartItem
);

// Get all items in user's cart
router.get("/", verifyJwtToken, cartItemController.getCartItems);

// Update cart item quantity
router.put(
  "/:cart_item_id",
  verifyJwtToken,
  validator(validators.cartItem.cartItemId, "params"),
  validator(validators.cartItem.updateCartItem, null),
  cartItemController.updateCartItem
);

// Remove item from cart
router.delete(
  "/:cart_item_id",
  verifyJwtToken,
  validator(validators.cartItem.cartItemId, "params"),
  cartItemController.removeCartItem
);

export default router;
