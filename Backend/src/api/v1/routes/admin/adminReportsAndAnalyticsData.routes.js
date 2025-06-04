import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminAnalyticsDashboardDataController } from "../../controllers/index.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyJwtToken,
  isAdmin,
  adminAnalyticsDashboardDataController.getAnalyticsDashboardData
);

export default router;
