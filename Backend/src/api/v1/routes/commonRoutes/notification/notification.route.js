import express from "express";
import { verifyJwtToken, adminRoleCheck, validator } from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js"
import { adminNotificationController } from "../../../controllers/index.js";

const router = express.Router();

// Get notifications for a user
router.get(
  "/me",
  verifyJwtToken,
  
  adminNotificationController.getUserNotifications
);

// Mark notification as read
router.patch(
  "/read",
  verifyJwtToken,
  adminNotificationController.markNotificationAsRead
);

// Create and broadcast notification
router.post(
  "/broadcast",
  verifyJwtToken,
  adminRoleCheck,
  
  adminNotificationController.createNotification
);

export default router;