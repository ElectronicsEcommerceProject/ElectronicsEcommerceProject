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
  // Handle multiple file uploads for product and variant productMedia
  upload.fields([
    { name: "media_file", maxCount: 1 },
    { name: "variant_media_file", maxCount: 1 }
  ]),
  adminProductManagmentDashboardDataController.addProductManagmentData
);

router.delete(
  "/:id",
  verifyJwtToken,
  isAdmin,
  adminProductManagmentDashboardDataController.deleteProductManagementData
);
router.patch(
  "/:id",
  verifyJwtToken,
  isAdmin,
  adminProductManagmentDashboardDataController.updateProductManagementData
);

export default router;
