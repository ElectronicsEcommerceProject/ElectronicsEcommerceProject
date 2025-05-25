import express from "express";
import {
  verifyJwtToken,
  validator,
  isAdmin,
  upload,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminProductManagmentDashboardDataController } from "../../controllers/index.js";

const router = express.Router();

router.get(
  "/",
  verifyJwtToken,
  adminProductManagmentDashboardDataController.getProductManagementData
);

router.post(
  "/",
  verifyJwtToken,
  isAdmin,
  validator(validators.productManagement.addProductManagementValidator, null),
  upload.single("productImage"), // Handle single file upload with field name 'productImage'
  adminProductManagmentDashboardDataController.addProductManagmentData
);

export default router;
