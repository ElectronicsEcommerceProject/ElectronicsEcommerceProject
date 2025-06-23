import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminCartController } from "../../controllers/index.js";

const router = express.Router();

// Get all carts (admin only)
router.get(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  adminCartController.getAllCarts
);

// Get cart by ID (admin only)
router.get(
  "/:cart_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.cart.cartIdValidator, "params"),
  adminCartController.getCartById
);

// Get cart by user ID (admin only)
router.get(
  "/user/:user_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.cart.userIdValidator, "params"),
  adminCartController.getCartByUserId
);

// Create a cart (admin only - for testing purposes)
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.cart.createCartValidator, null),
  adminCartController.createCart
);

// Delete a cart (admin only)
router.delete(
  "/:cart_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.cart.cartIdValidator, "params"),
  adminCartController.deleteCart
);

export default router;
