import express from 'express';
import { getProfile, updateProfile } from '../api/v1/controllers/profileController.js';
import { verifyJwtToken } from '../middleware/jwt.js';
import upload from '../middleware/multer.js'; // Import multer middleware

const router = express.Router();

// Route to get user profile
router.get('/', verifyJwtToken, getProfile);

// Route to update user profile with profile image upload
router.put('/', verifyJwtToken, upload.single('profileImage'), updateProfile);

export default router;