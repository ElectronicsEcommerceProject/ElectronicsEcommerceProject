import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminDashboardController } from "../../controllers/index.js";

const router = express.Router();

router.get(
  "/",
  verifyJwtToken,
  isAdmin,
  adminDashboardController.getAdminDashboardData
);

export default router;
