import express from "express";

import { validator } from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";
import {
  loginController,
  registerController,
  resetPasswordController,
  approveRejectBanUserController,
} from "../../../controllers/index.js";

const router = express.Router();

// Route for user registration
router.post(
  "/register",
  validator(validators.auth.register, null),
  registerController
);
router.post("/login", validator(validators.auth.login, null), loginController);

router.post(
  "/forgot-Password",
  validator(validators.auth.forgotPasswordValidator, null),
  resetPasswordController.forgotPassword
);
router.post(
  "/reset-Password",
  validator(validators.auth.resetPasswordValidator, null),
  resetPasswordController.resetPassword
);

// User status management routes
router.put(
  "/user/:user_id/approve",
  // Add middleware for admin authentication here
  approveRejectBanUserController.approveUser
);

router.put(
  "/user/:user_id/reject",
  // Add middleware for admin authentication here
  approveRejectBanUserController.rejectUser
);

router.put(
  "/user/:user_id/ban",
  // Add middleware for admin authentication here
  approveRejectBanUserController.banUser
);

router.put(
  "/user/:user_id/status",
  // Add middleware for admin authentication here
  approveRejectBanUserController.changeUserStatus
);

export default router;
