import express from 'express';
import { createReview, updateReview } from '../api/v1/controllers/reviewController.js';
import { verifyJwtToken } from '../middleware/jwt.js';
import { roleCheck } from '../middleware/roleCheck.js'; // reusable role check

const router = express.Router();

// 📝 Customer, retailer creates a product review
router.post('/', verifyJwtToken, createReview);

// ✏️ Admin edits a review 
router.put('/:review_id', verifyJwtToken, roleCheck, updateReview);

export default router;
