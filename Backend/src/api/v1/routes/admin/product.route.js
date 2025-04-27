import express from "express";

import { roleCheck } from "../middleware/roleCheck.js"; // Middleware to check admin role
import { verifyJwtToken } from "../middleware/jwt.js"; // Middleware to verify JWT token
import { validators } from "../../validators/index.js";
import { validator } from "../middleware/validator.js"; // Middleware for request validation
import { adminProductController } from "../../controllers/index.js";

const router = express.Router();

// CRUD routes for products
router.post("/", verifyJwtToken, roleCheck,validator(validators.product.createProduct,null), adminProductController.createProduct); // Create a new product
router.get("/", verifyJwtToken, adminProductController.getProducts); // Get all products
// Get products by category ID
router.get(
  "/category/:categoryId",
  verifyJwtToken,
  adminProductController.getProductsByCategoryId
); 

// Get product by ID
router.get("/:id", verifyJwtToken, adminProductController.getProductById); // Get a product by ID

router.put("/:id", verifyJwtToken, roleCheck,validator(validators.product.updateProduct,null), adminProductController.updateProduct); // Update a product by ID
router.delete("/:id", verifyJwtToken, roleCheck, adminProductController.deleteProduct); // Delete a product by ID

export default router;