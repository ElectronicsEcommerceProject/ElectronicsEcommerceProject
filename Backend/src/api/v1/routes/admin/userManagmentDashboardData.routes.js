import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminUserManagmentDashboardDataController } from "../../controllers/index.js";

const router = express.Router();

router.get(
  "/",
  verifyJwtToken,
  isAdmin,
  adminUserManagmentDashboardDataController.getUserManagementDashboardData
);

export default router;
