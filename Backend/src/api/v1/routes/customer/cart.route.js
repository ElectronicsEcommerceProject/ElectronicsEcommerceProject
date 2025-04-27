import express from 'express';

import { verifyJwtToken } from '../middleware/jwt.js';
import { customerCartController } from '../../controllers/index.js';

const router = express.Router();

// ✅ Add item to cart
router.post('/', verifyJwtToken, customerCartController.addToCart);

// ✅ Get all items in user's cart
router.get('/', verifyJwtToken, customerCartController.getCart);

// ✅ Update quantity of a specific item
router.put('/:product_id', verifyJwtToken, customerCartController.updateCartItem);

// ✅ Remove item from cart
router.delete('/:product_id', verifyJwtToken,customerCartController.removeFromCart);

export default router;