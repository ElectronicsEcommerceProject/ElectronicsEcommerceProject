import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminProductMediaController } from "../../controllers/index.js";
const router = express.Router();

// Add a new product media
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMedia.productMediaValidator, null),
  adminProductMediaController.addProductMedia
);

// Get all product media
router.get("/", verifyJwtToken, adminProductMediaController.getAllProductMedia);

// Get product media by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productMedia.id, "params"),
  adminProductMediaController.getProductMediaById
);

// Get product media by product ID
router.get(
  "/product/:productId",
  verifyJwtToken,
  adminProductMediaController.getProductMediaByProduct
);

// Get product media by variant ID
router.get(
  "/variant/:variantId",
  verifyJwtToken,
  adminProductMediaController.getProductMediaByVariant
);

// Update a product media
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMedia.id, "params"),
  validator(validators.productMedia.productMediaUpdateValidator, null),
  adminProductMediaController.updateProductMedia
);

// Delete a product media
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMedia.id, "params"),
  adminProductMediaController.deleteProductMedia
);

export default router;
