import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';

import { customerWishlistController } from '../../controllers/index.js';

const router = express.Router();

router.post('/', verifyJwtToken, customerWishlistController.addToWishlist);            // Add item to wishlist
router.get('/', verifyJwtToken,customerWishlistController.getWishlist);               // Get all wishlist items
router.delete('/:product_id', verifyJwtToken, customerWishlistController.removeFromWishlist);  // Remove item

export default router;
