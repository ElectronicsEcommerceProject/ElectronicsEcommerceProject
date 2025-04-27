import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId,
  getProductById,
} from "../api/v1/controllers/productController.js";
import { roleCheck } from "../middleware/roleCheck.js"; // Middleware to check admin role
import { verifyJwtToken } from "../middleware/jwt.js"; // Middleware to verify JWT token
import { validators } from "../../validators/index.js";
import { validator } from "../middleware/validator.js"; // Middleware for request validation

const router = express.Router();

// CRUD routes for products
router.post("/", verifyJwtToken, roleCheck,validator(validators.product.createProduct,null), createProduct); // Create a new product
router.get("/", verifyJwtToken, getProducts); // Get all products
// Get products by category ID
router.get(
  "/category/:categoryId",
  verifyJwtToken,
  getProductsByCategoryId
); 

// Get product by ID
router.get("/:id", verifyJwtToken, getProductById); // Get a product by ID

router.put("/:id", verifyJwtToken, roleCheck,validator(validators.product.updateProduct,null), updateProduct); // Update a product by ID
router.delete("/:id", verifyJwtToken, roleCheck, deleteProduct); // Delete a product by ID

export default router;