import express from 'express';

import { verifyJwtToken } from '../middleware/jwt.js';
import { customerReviewController } from '../../controllers/index.js';

const router = express.Router();

// 📝 Customer, retailer creates a product review
router.post('/', verifyJwtToken, customerReviewController.createReview);


export default router;
