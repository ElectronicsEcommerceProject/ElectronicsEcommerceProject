import express from 'express';
import { verifyJwtToken } from '../../../../middleware/jwt.js';

import { retailerrWishlistController } from '../../controllers/index.js';

const router = express.Router();

router.post('/', verifyJwtToken, retailerrWishlistController.addToWishlist);            // Add item to wishlist
router.get('/', verifyJwtToken, retailerrWishlistController.getWishlist);               // Get all wishlist items
router.delete('/:product_id', verifyJwtToken, retailerrWishlistController.removeFromWishlist);  // Remove item

export default router;
