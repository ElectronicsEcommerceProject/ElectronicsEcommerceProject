import express from 'express';
import { verifyJwtToken } from '../middleware/jwt.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/', verifyJwtToken, addToWishlist);            // Add item to wishlist
router.get('/', verifyJwtToken, getWishlist);               // Get all wishlist items
router.delete('/:product_id', verifyJwtToken, removeFromWishlist);  // Remove item

export default router;
