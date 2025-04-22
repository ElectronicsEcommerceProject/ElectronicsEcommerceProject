import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { verifyJwtToken } from '../middleware/jwt.js';

const router = express.Router();

// Route for user registration
router.get('/',verifyJwtToken, getProfile);
router.put('/',verifyJwtToken, updateProfile);
export default router;