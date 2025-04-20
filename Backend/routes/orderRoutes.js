import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  requestOrderCancellation,
  getAllOrdersForAdmin,
} from '../controllers/orderController.js';

import { roleCheck } from '../middleware/roleCheck.js'; // Import the roleCheck middleware

const router = express.Router();

// 📦 Place new order
router.post('/', verifyJwtToken, createOrder);

// 📄 Get all orders for logged-in user
router.get('/', verifyJwtToken, getOrders);

// 🧑‍💼 Admin: Get all orders (add below existing routes)
router.get('/admin', verifyJwtToken, roleCheck, getAllOrdersForAdmin);

// 🔍 Get single order by ID
router.get('/:id', verifyJwtToken, getOrderById);

// ❌ Request order cancellation
router.patch('/:id/cancel', verifyJwtToken, requestOrderCancellation);

export default router;
