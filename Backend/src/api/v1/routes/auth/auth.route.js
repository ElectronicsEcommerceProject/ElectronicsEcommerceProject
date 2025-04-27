import express from 'express';
import { register,login } from '../api/v1/controllers/authController.js'; // Import the register function from authController.js
import service from '../../../../services/index.js';
import { validator } from '../../middleware/validator.js';
import { validators } from '../../validators/index.js';

const router = express.Router();

// Route for user registration
router.post('/register',validator(validators.auth.register,null), register);
router.post('/login',validator(validators.auth.login,null), login);
// router.post('/register', register); // for testing purpose only
// router.post('/login', login)

export default router;