import express from "express";

import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";

import { validators } from "../../validators/index.js";
import { adminBrandController } from "../../controllers/index.js";

const router = express.Router();

//write get, post, put, delete routes for brand routes
// Add a new category
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.brand.brandValidator, null),
  adminBrandController.addBrand // Add brand controller middleware here
);

// Get all brands //esmai adminRoleCheck ka koi jarurat nahi hai kyuki sabko dekhne hai...
router.get("/", verifyJwtToken, adminBrandController.getAllBrands);

// Update a category
router.put(
  "/:brand_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.brand.brand_id, "params"), // Add validator middleware for category update validation
  adminBrandController.updateBrand // Add brand controller middleware here for brand update validation
);

// Delete a category
router.delete(
  "/:brand_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.brand.brand_id, "params"), // Add validator middleware for category deletion validation
  adminBrandController.deleteBrand // Add brand controller middleware here for brand deletion validation. This middleware will handle the deletion of the brand.
);

export default router;
