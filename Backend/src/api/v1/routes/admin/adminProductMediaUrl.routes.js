import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminproductMediaUrlController } from "../../controllers/index.js";
const router = express.Router();

// Add a new product media URL
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.productMediaUrlValidator, null),
  adminproductMediaUrlController.addproductMediaUrl
);

// Get all product media URLs
router.get(
  "/",
  verifyJwtToken,
  adminproductMediaUrlController.getAllproductMediaUrls
);

// Get product media URL by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productMediaUrl.id, "params"),
  adminproductMediaUrlController.getproductMediaUrlById
);

// Get product media URLs by media ID
router.get(
  "/media/:mediaId",
  verifyJwtToken,
  adminproductMediaUrlController.getproductMediaUrlsByMediaId
);

// Update a product media URL
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.id, "params"),
  validator(validators.productMediaUrl.productMediaUrlUpdateValidator, null),
  adminproductMediaUrlController.updateproductMediaUrl
);

// Delete a product media URL
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.id, "params"),
  adminproductMediaUrlController.deleteproductMediaUrl
);

export default router;
