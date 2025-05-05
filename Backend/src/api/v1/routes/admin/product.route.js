import express from "express";

import { adminRoleCheck } from "../../../../middleware/roleCheck.middleware.js";
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
router.get("/", verifyJwtToken, adminProductController.getProducts);

// Get products by category ID
router.get(
  "/category/:categoryId",
  verifyJwtToken,
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
