import express from "express";

import { validators } from "../../../validators/index.js";

import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../../middleware/index.js";

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

// Note: Retailer approval routes have been moved to admin/adminRetailerApproval.routes.js

export default router;