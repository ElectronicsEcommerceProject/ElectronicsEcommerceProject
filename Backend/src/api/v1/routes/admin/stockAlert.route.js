import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminStockAlertController } from "../../controllers/index.js";

const router = express.Router();

// Get all stock alerts (with optional status filter)
router.get(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  adminStockAlertController.getAllStockAlerts
);

// Get stock alert by ID
router.get(
  "/:alert_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.stockAlert.alertId, "params"),
  adminStockAlertController.getStockAlertById
);

// Create a new stock alert
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.stockAlert.stockAlertValidator, null),
  adminStockAlertController.createStockAlert
);

// Update a stock alert
router.put(
  "/:alert_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.stockAlert.alertId, "params"),
  validator(validators.stockAlert.stockAlertUpdateValidator, null),
  adminStockAlertController.updateStockAlert
);

// Mark alert as sent
router.patch(
  "/:alert_id/send",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.stockAlert.alertId, "params"),
  adminStockAlertController.markAlertAsSent
);

// Delete a stock alert
router.delete(
  "/:alert_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.stockAlert.alertId, "params"),
  adminStockAlertController.deleteStockAlert
);

export default router;
