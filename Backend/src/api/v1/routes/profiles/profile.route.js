import express from 'express';

import { validator } from '../../../../middleware/validator/validator.middleware.js';
import { validators } from '../../validators/index.js';
import { profileController } from '../../controllers/index.js';
import upload from '../../../../middleware/multer.js'; // Import multer middleware
import { verifyJwtToken } from '../../../../middleware/jwt.js';

const router = express.Router();

// Use multer middleware for file upload in the update profile route
router.put(
  '/profile',
  upload.single('profileImage'), // Handle single file upload with field name 'profileImage'
  validator(validators.profile.profile, null),verifyJwtToken,
  profileController.updateProfile
);

router.get('/profile', verifyJwtToken, profileController.getProfile);

export default router;