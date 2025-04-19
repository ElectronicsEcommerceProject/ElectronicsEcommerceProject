import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  requestOrderCancellation,
} from '../controllers/orderController.js';

const router = express.Router();

// 📦 Place new order
router.post('/', verifyJwtToken, createOrder);

// 📄 Get all orders for logged-in user
router.get('/', verifyJwtToken, getOrders);

// 🔍 Get single order by ID
router.get('/:id', verifyJwtToken, getOrderById);

// ❌ Request order cancellation
router.patch('/:id/cancel', verifyJwtToken, requestOrderCancellation);

export default router;
