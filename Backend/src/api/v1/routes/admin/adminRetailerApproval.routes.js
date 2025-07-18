import express from "express";
import { verifyJwtToken, adminRoleCheck } from "../../../../middleware/index.js";
import { approveRejectBanUserController } from "../../controllers/index.js";

const router = express.Router();

// Get pending retailers route
router.get(
  "/pending-Retailers",
  verifyJwtToken,
  adminRoleCheck,
  approveRejectBanUserController.getPendingRetailers
);

// User status management routes
router.put(
  "/:user_id/approve",
  verifyJwtToken,
  adminRoleCheck,
  approveRejectBanUserController.approveUser
);

router.put(
  "/:user_id/reject",
  verifyJwtToken,
  adminRoleCheck,
  approveRejectBanUserController.rejectUser
);

router.put(
  "/:user_id/ban",
  verifyJwtToken,
  adminRoleCheck,
  approveRejectBanUserController.banUser
);

router.put(
  "/:user_id/status",
  verifyJwtToken,
  adminRoleCheck,
  approveRejectBanUserController.changeUserStatus
);

export default router;