import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminproductMediaUrlController } from "../../controllers/index.js";
const router = express.Router();

// Add a new product productMedia URL
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.productMediaUrlValidator, null),
  adminproductMediaUrlController.addproductMediaUrl
);

// Get all product productMedia URLs
router.get(
  "/",
  verifyJwtToken,
  adminproductMediaUrlController.getAllproductMediaUrl
);

// Get product productMedia URL by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productMediaUrl.id, "params"),
  adminproductMediaUrlController.getproductMediaUrlById
);

// Get product productMedia URLs by productMedia ID
router.get(
  "/productMedia/:mediaId",
  verifyJwtToken,
  adminproductMediaUrlController.getproductMediaUrlByMediaId
);

// Update a product productMedia URL
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.id, "params"),
  validator(validators.productMediaUrl.productMediaUrlUpdateValidator, null),
  adminproductMediaUrlController.updateproductMediaUrl
);

// Delete a product productMedia URL
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productMediaUrl.id, "params"),
  adminproductMediaUrlController.deleteproductMediaUrl
);

export default router;
