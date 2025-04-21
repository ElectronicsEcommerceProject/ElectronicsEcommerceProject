import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId,
} from "../controllers/productController.js";
import { roleCheck } from "../middleware/roleCheck.js"; // Middleware to check admin role
import { verifyJwtToken } from "../middleware/jwt.js"; // Middleware to verify JWT token

const router = express.Router();

// CRUD routes for products
router.post("/", verifyJwtToken, roleCheck, createProduct); // Create a new product
router.get("/", verifyJwtToken, getProducts); // Get all products
router.get(
  "/category/:categoryId",
  verifyJwtToken,
  getProductsByCategoryId
); // Get products by category ID
router.put("/:id", verifyJwtToken, roleCheck, updateProduct); // Update a product by ID
router.delete("/:id", verifyJwtToken, roleCheck, deleteProduct); // Delete a product by ID

export default router;