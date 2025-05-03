import express from "express";

import { validator } from "../../../../middleware/validator/validator.middleware.js";
import { validators } from "../../validators/index.js";
import { profileController } from "../../controllers/index.js";
import { addressController } from "../../controllers/index.js";
import upload from "../../../../middleware/multer.js"; // Import multer middleware
import { verifyJwtToken } from "../../../../middleware/jwt.js";

const router = express.Router();

// Use multer middleware for file upload in the update profile route
router.put(
  "/profile",
  upload.single("profileImage"), // Handle single file upload with field name 'profileImage'
  validator(validators.profile.profile, null),
  verifyJwtToken,
  profileController.updateProfile
);

router.get("/profile", verifyJwtToken, profileController.getProfile);

router.post(
  "/addresses",
  verifyJwtToken,
  validator(validators.address.addressValidator, null),
  addressController.addAddress
);

router.get("/addresses", verifyJwtToken, addressController.getAddresses);
router.get(
  "/addresses/:id",
  validator(validators.address.id, "params"), // Pass "params" as the property to validate
  verifyJwtToken,
  addressController.getAddressById
);
router.put(
  "/addresses/:id",
  validator(validators.address.updateAddressValidator, null),
  validator(validators.address.id, "params"), // Add params validation
  verifyJwtToken,
  addressController.updateAddress
);
router.delete(
  "/addresses/:id",
  validator(validators.address.id, "params"), // Pass "params" as the property to validate
  verifyJwtToken,
  addressController.deleteAddress
);

export default router;
