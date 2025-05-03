import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminStockAlertController } from "../../controllers/index.js";

const router = express.Router();

// ✅ Get all pending/low stock alerts
router.get(
  "/",
  verifyJwtToken,
  isAdmin,
  adminStockAlertController.getAllStockAlerts
);

// ✅ Mark alert as sent
router.patch(
  "/:alert_id/send",
  verifyJwtToken,
  isAdmin,
  adminStockAlertController.markAlertAsSent
);

export default router;
