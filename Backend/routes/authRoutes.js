import express from 'express';
import { register } from '../controllers/authController.js'; // Import the register function from authController.js

const router = express.Router();

// Route for user registration
router.post('/register', register);

export default router;