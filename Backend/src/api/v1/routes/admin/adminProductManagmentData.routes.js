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
  // Update the field name to match what's used in the frontend
  upload.single("media_file"),
  adminProductManagmentDashboardDataController.addProductManagmentData
);

export default router;
