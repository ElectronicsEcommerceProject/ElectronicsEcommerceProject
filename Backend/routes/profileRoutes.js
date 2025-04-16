import express from 'express';
import { getProfile } from '../controllers/profileController.js';
import { verifyJwtToken } from '../middleware/jwt.js';

const router = express.Router();

// Route for user registration
router.get('/getProfile',verifyJwtToken, getProfile);
// router.put('/updateProfile', updateProfile);
export default router;