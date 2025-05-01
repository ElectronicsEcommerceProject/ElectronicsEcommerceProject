import express from 'express';

import { verifyJwtToken } from '../../../../middleware/jwt.js';
import { roleCheck } from '../../../../middleware/roleCheck.js';
import { adminUserController } from '../../controllers/index.js';

const router = express.Router();

// 🧑‍💼 Admin-only routes
router.get('/', verifyJwtToken, roleCheck, adminUserController.getAllUsers);
router.delete('/:id', verifyJwtToken, adminUserController.deleteUser);

export default router;
