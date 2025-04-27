import express from 'express';

import { verifyJwtToken } from '../middleware/jwt.js';
import { roleCheck } from '../middleware/roleCheck.js'; // Only admin should access
import { adminStockAlertController } from '../../controllers/index.js';

const router = express.Router();

// ✅ Get all pending/low stock alerts
router.get('/', verifyJwtToken, roleCheck,adminStockAlertController.getAllStockAlerts);

// ✅ Mark alert as sent
router.patch('/:alert_id/send', verifyJwtToken, roleCheck, adminStockAlertController.markAlertAsSent);

export default router;
