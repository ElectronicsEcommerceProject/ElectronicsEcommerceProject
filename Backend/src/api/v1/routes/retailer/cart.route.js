import express from 'express';

import { verifyJwtToken } from '../../../../middleware/jwt.js';
import { retailerCartController } from '../../controllers/index.js';

const router = express.Router();

// ✅ Add item to cart
router.post('/', verifyJwtToken, retailerCartController.addToCart);

// ✅ Get all items in user's cart
router.get('/', verifyJwtToken,retailerCartController.getCart);

// ✅ Update quantity of a specific item
router.put('/:product_id', verifyJwtToken, retailerCartController.updateCartItem);

// ✅ Remove item from cart
router.delete('/:product_id', verifyJwtToken, retailerCartController.removeFromCart);

export default router;