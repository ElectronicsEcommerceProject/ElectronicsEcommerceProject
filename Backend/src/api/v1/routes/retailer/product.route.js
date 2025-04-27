import express from "express";

import { verifyJwtToken } from "../middleware/jwt.js"; // Middleware to verify JWT token
import { retailerProductController } from "../../controllers/index.js";

const router = express.Router();

router.get("/", verifyJwtToken, retailerProductController.getProducts); // Get all products
// Get products by category ID
router.get(
  "/category/:categoryId",
  verifyJwtToken,
  retailerProductController.getProductsByCategoryId
); 

// Get product by ID
router.get("/:id", verifyJwtToken, retailerProductController.getProductById); // Get a product by ID

export default router;