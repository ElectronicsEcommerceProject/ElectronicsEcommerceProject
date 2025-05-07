import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminProductVariantController } from "../../controllers/index.js";

const router = express.Router();

// Create a new product variant
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productVariant.createVariant, null),
  adminProductVariantController.createProductVariant
);

// Get all product variants
router.get(
  "/",
  verifyJwtToken,
  adminProductVariantController.getAllProductVariants
);

// Get product variant by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productVariant.id, "params"),
  adminProductVariantController.getProductVariantById
);

// Get variants by product ID
router.get(
  "/product/:productId",
  verifyJwtToken,
  adminProductVariantController.getVariantsByProductId
);

// Update a product variant
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productVariant.id, "params"),
  validator(validators.productVariant.updateVariant, null),
  adminProductVariantController.updateProductVariant
);

// Delete a product variant
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productVariant.id, "params"),
  adminProductVariantController.deleteProductVariant
);

export default router;
