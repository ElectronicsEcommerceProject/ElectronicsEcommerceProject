import express from 'express';
import { getAllUsers, deleteUser } from '../api/v1/controllers/userController.js';
import { verifyJwtToken } from '../middleware/jwt.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// 🧑‍💼 Admin-only routes
router.get('/', verifyJwtToken, roleCheck, getAllUsers);
router.delete('/:id', verifyJwtToken, deleteUser);

export default router;
