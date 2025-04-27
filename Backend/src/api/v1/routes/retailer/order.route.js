import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';

import { retailerOrderController } from '../../controllers/index.js';

const router = express.Router();

// 📦 Place new order
router.post('/', verifyJwtToken, retailerOrderController.createOrder);

// 📄 Get all orders for logged-in user
router.get('/', verifyJwtToken, retailerOrderController.getOrders);

// 🔍 Get single order by ID
router.get('/:id', verifyJwtToken, retailerOrderController.getOrderById);

// ❌ Request order cancellation
router.patch('/:id/cancel', verifyJwtToken, retailerOrderController.requestOrderCancellation);

export default router;
