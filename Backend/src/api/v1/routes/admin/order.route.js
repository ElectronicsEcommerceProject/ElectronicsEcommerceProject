import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';


import { roleCheck } from '../middleware/roleCheck.js'; // Import the roleCheck middleware
import { adminOrderController } from '../../controllers/index.js';

const router = express.Router();


// 🧑‍💼 Admin: Get all orders (add below existing routes)
router.get('/', verifyJwtToken, roleCheck, adminOrderController.getAllOrdersForAdmin);

// 🔍 Get single order by ID
router.get('/:id', verifyJwtToken, adminOrderController.getOrderById);

// ❌ Request order cancellation
router.patch('/:id/cancel', verifyJwtToken, adminOrderController.requestOrderCancellation);

export default router;
