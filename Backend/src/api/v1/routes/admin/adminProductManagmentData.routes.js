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
  // Handle file upload first, before validation
  upload.single("productImage"),
  // Then validate the rest of the data
  // validator(validators.productManagement.addProductManagementValidator, null),
  adminProductManagmentDashboardDataController.addProductManagmentData
);

export default router;
