import express from 'express';

import { verifyJwtToken } from '../../../../middleware/jwt.js';
import upload from '../../../../middleware/multer.js'; // Import multer middleware
import profileController from '../../controllers/profile.controller.js';

const router = express.Router();

// Route to get user profile
router.get('/', verifyJwtToken,profileController.getProfile);

// Route to update user profile with profile image upload
router.put('/', verifyJwtToken, upload.single('profileImage'), profileController.updateProfile);

export default router;