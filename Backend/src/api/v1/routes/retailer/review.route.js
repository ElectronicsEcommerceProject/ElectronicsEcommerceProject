import express from 'express';

import { verifyJwtToken } from '../middleware/jwt.js';

import { retailerReviewController } from '../../controllers/index.js';

const router = express.Router();

// 📝 Customer, retailer creates a product review
router.post('/', verifyJwtToken, retailerReviewController.createReview);


export default router;
