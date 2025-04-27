import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';
import { roleCheck } from '../middleware/roleCheck.js'; // reusable role check
import { adminReviewController } from '../../controllers/index.js';

const router = express.Router();

// ✏️ Admin edits a review 
router.put('/:review_id', verifyJwtToken, roleCheck, adminReviewController.updateReview);

export default router;
