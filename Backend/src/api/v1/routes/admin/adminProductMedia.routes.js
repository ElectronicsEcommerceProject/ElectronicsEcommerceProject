import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminProductMediaController } from "../../controllers/index.js";
const router = express.Router();

// Add a new product productMedia
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMedia.productMediaValidator, null),
  adminProductMediaController.addProductMedia
);

// Get all product productMedia
router.get("/", verifyJwtToken, adminProductMediaController.getAllProductMedia);

// Get product productMedia by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productMedia.id, "params"),
  adminProductMediaController.getProductMediaById
);

// Get product productMedia by product ID
router.get(
  "/product/:productId",
  verifyJwtToken,
  adminProductMediaController.getProductMediaByProduct
);

// Get product productMedia by variant ID
router.get(
  "/variant/:variantId",
  verifyJwtToken,
  adminProductMediaController.getProductMediaByVariant
);

// Update a product productMedia
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMedia.id, "params"),
  validator(validators.productMedia.productMediaUpdateValidator, null),
  adminProductMediaController.updateProductMedia
);

// Delete a product productMedia
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMedia.id, "params"),
  adminProductMediaController.deleteProductMedia
);

export default router;
