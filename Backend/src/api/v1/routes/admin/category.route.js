import express from "express";

import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { adminCategoryController } from "../../controllers/index.js";
import { validators } from "../../validators/index.js";

const router = express.Router();

// Add a new category
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.category.categoryValidator, null),
  adminCategoryController.addCategory
);

// Get all categories //esmai adminRoleCheck ka koi jarurat nahi hai kyuki sabko dekhne hai...
router.get("/", verifyJwtToken, adminCategoryController.getAllCategories);

// Update a category
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.category.id, "params"), // Add validator middleware for category update validation
  adminCategoryController.updateCategory
);

// Delete a category
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.category.id, "params"), // Add validator middleware for category deletion validation
  adminCategoryController.deleteCategory
);

export default router;
