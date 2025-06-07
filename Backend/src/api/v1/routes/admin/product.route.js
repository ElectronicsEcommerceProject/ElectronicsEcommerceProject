import express from "express";

import { adminRoleCheck } from "../../../../middleware/AdminRoleCheck.middleware.js";
import { verifyJwtToken } from "../../../../middleware/jwt.middleware.js";
import { validators } from "../../validators/index.js";
import { validator } from "../../../../middleware/validator/validator.middleware.js";
import { adminProductController } from "../../controllers/index.js";

const router = express.Router();

// Create a new product
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.product.createProduct, null),
  adminProductController.createProduct
);

// Get all products
router.get("/", verifyJwtToken, adminProductController.getAllProducts);

// Get products by category_id and brand_id
// Get products by category_id and brand_id
router.get(
  "/category/:category_id/brand/:brand_id",
  verifyJwtToken,

  adminProductController.getProductsByCategoryAndBrand
);

// Get products by category ID
router.get(
  "/category/:category_id",
  verifyJwtToken,
  validator(validators.product.id, "params"),
  adminProductController.getProductsByCategoryId
);

// Get product by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.product.id, "params"),
  adminProductController.getProductById
);

// Update a product by ID
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.product.id, "params"),
  validator(validators.product.updateProduct, null),
  adminProductController.updateProduct
);

// Delete a product by ID
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.product.id, "params"),
  adminProductController.deleteProduct
);

export default router;
