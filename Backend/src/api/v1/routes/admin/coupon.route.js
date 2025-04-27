import express from 'express';
import { createCoupon } from '../api/v1/controllers/coupon.controller.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { verifyJwtToken } from '../middleware/jwt.js';

const router = express.Router();

// Route to create a new coupon
router.post('/',verifyJwtToken ,roleCheck,createCoupon);

export default router;