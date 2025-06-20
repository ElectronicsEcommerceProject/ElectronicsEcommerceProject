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
router.patch(
  "/:user_id",
  upload.single("profileImage"), // Handle single file upload with field name 'profileImage'
  validator(validators.profile.profile, null),
  // validator(validators.profile.user_id, "params"),
  verifyJwtToken,
  profileController.updateProfile
);

router.get(
  "/:user_id",
  verifyJwtToken,
  // validator(validators.profile.user_id, "params"),
  profileController.getProfileByUserId
);

export default router;
