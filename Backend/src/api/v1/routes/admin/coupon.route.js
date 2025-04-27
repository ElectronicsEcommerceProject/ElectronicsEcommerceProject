import express from 'express';

import { roleCheck } from '../middleware/roleCheck.js';
import { verifyJwtToken } from '../middleware/jwt.js';
import { adminCouponController } from '../../controllers/index.js';

const router = express.Router();

// Route to create a new coupon
router.post('/',verifyJwtToken ,roleCheck,adminCouponController.createCoupon);

export default router;