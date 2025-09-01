import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminProductMediaURLController } from "../../controllers/index.js";
const router = express.Router();

// Add a new product media URL
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.productMediaUrlValidator, null),
  adminProductMediaURLController.addProductMediaURL
);

// Get all product media URLs
router.get(
  "/",
  verifyJwtToken,
  adminProductMediaURLController.getAllproductMediaUrl
);

// Get product media URL by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productMediaUrl.id, "params"),
  adminProductMediaURLController.getProductMediaURLById
);

// Get product media URLs by media ID
router.get(
  "/media/:mediaId",
  verifyJwtToken,
  adminProductMediaURLController.getproductMediaUrlByMediaId
);

// Update a product media URL
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.id, "params"),
  validator(validators.productMediaUrl.productMediaUrlUpdateValidator, null),
  adminProductMediaURLController.updateProductMediaURL
);

// Delete a product media URL
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.id, "params"),
  adminProductMediaURLController.deleteProductMediaURL
);

export default router;
