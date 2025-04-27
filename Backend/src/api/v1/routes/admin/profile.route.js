import express from 'express';

import { verifyJwtToken } from '../../../../middleware/jwt.js';
import upload from '../../../../middleware/multer.js';
import { profileController } from '../../controllers/index.js';
 // Import multer middleware

const router = express.Router();

// Route to get user profile
router.get('/', verifyJwtToken, profileController.getProfile);

// Route to update user profile with profile image upload
router.put('/', verifyJwtToken, upload.single('profileImage'), profileController.updateProfile);

export default router;