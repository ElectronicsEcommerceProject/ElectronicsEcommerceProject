import express from "express";

import { verifyJwtToken } from "../../../../middleware/jwt.middleware.js"; // Middleware to verify JWT token
import { customerProductController } from "../../controllers/index.js";

const router = express.Router();

router.get("/", verifyJwtToken, customerProductController.getProducts); // Get all products
// Get products by category ID
router.get(
  "/category/:categoryId",
  verifyJwtToken,
  customerProductController.getProductsByCategoryId
);

// Get product by ID
router.get("/:id", verifyJwtToken, customerProductController.getProductById); // Get a product by ID

export default router;
