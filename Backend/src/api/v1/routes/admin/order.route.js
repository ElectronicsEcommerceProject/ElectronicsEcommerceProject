import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  requestOrderCancellation,
  getAllOrdersForAdmin,
} from '../api/v1/controllers/orderController.js';

import { roleCheck } from '../middleware/roleCheck.js'; // Import the roleCheck middleware
import { adminOrderController } from '../../controllers/index.js';

const router = express.Router();

// 📦 Place new order
router.post('/', verifyJwtToken, adminOrderController.createOrder);

// 📄 Get all orders for logged-in user
router.get('/', verifyJwtToken, adminOrderController.getOrders);

// 🧑‍💼 Admin: Get all orders (add below existing routes)
router.get('/admin', verifyJwtToken, roleCheck, adminOrderController.getAllOrdersForAdmin);

// 🔍 Get single order by ID
router.get('/:id', verifyJwtToken, adminOrderController.getOrderById);

// ❌ Request order cancellation
router.patch('/:id/cancel', verifyJwtToken, adminOrderController.requestOrderCancellation);

export default router;
