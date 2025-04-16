import express from 'express';
import { register,login } from '../controllers/authController.js'; // Import the register function from authController.js

const router = express.Router();

// Route for user registration
router.post('/register', register);
router.post('/login', login)

export default router;