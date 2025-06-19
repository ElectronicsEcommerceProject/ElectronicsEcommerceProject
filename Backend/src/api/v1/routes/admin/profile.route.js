import express from "express";

import { verifyJwtToken, upload } from "../../../../middleware/index.js";
import profileController from "../../controllers/commonControllers/profile/profile.controller.js";

const router = express.Router();

// Route to get user profile
router.get("/user_id", verifyJwtToken, profileController.getProfileByUserId);

// Route to update user profile with profile image upload
router.put(
  "/user_id",
  verifyJwtToken,
  upload.single("profileImage"),
  profileController.updateProfile
);

export default router;
