import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminProductTypeController } from "../../controllers/index.js";

const router = express.Router();

// Add a new product type
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productType.productTypeValidator, null),
  adminProductTypeController.addProductType
);

// Get all product types
router.get("/", verifyJwtToken, adminProductTypeController.getAllProductTypes);

// Update a product type
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productType.id, "params"),
  validator(validators.productType.productTypeUpdateValidator, null),
  adminProductTypeController.updateProductType
);

// Delete a product type
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productType.id, "params"),
  adminProductTypeController.deleteProductType
);

export default router;
