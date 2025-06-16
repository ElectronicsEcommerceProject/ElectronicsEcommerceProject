import express from "express";
import { validator } from "../../../../../middleware/index.js";
import { verifyJwtToken } from "../../../../../middleware/jwt.middleware.js";
import { cartController } from "../../../controllers/index.js";
import { validators } from "../../../validators/index.js";

const router = express.Router();

// Add item to cart
router.post(
  "/",
  verifyJwtToken,
  validator(validators.cart.createCart, null),
  cartController.createCart
);

// Get all items in user's cart
router.get("/", verifyJwtToken, cartController.getAllCarts);

router.get(
  "/:user_id",
  verifyJwtToken,
  cartController.findOrCreateCartByUserId
);

// Remove item from cart
router.delete(
  "/:cart_id",
  verifyJwtToken,
  validator(validators.cart.userId, "params"), // Add params validation for cart ID
  cartController.deleteCart
);

export default router;
