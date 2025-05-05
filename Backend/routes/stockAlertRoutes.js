import express from 'express';
import {
  getAllStockAlerts,
  markAlertAsSent
} from '../controllers/stockAlertController.js';
import { verifyJwtToken } from '../middleware/jwt.js';
import { roleCheck } from '../middleware/roleCheck.js'; // Only admin should access

const router = express.Router();

// ✅ Get all pending/low stock alerts
router.get('/', verifyJwtToken, roleCheck, getAllStockAlerts);

// ✅ Mark alert as sent
router.patch('/:alert_id/send', verifyJwtToken, roleCheck, markAlertAsSent);

export default router;
