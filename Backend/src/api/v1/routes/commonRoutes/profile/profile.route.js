import express from "express";

import {
  validator,
  verifyJwtToken,
  upload,
} from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";
import { profileController } from "../../../controllers/index.js";

const router = express.Router();

// Use multer middleware for file upload in the update profile route
router.put(
  "/",
  upload.single("profileImage"), // Handle single file upload with field name 'profileImage'
  validator(validators.profile.profile, null),
  verifyJwtToken,
  profileController.updateProfile
);

router.get("/", verifyJwtToken, profileController.getProfile);

export default router;
