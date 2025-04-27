import express from 'express';
// import { addToCart, getCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
// import { verifyJwtToken } from '../middleware/jwt.js';

const router = express.Router();

// ✅ Add item to cart
// router.post('/', verifyJwtToken, addToCart);

// // ✅ Get all items in user's cart
// router.get('/', verifyJwtToken, getCart);

// // ✅ Update quantity of a specific item
// router.put('/:product_id', verifyJwtToken, updateCartItem);

// // ✅ Remove item from cart
// router.delete('/:product_id', verifyJwtToken, removeFromCart);

export default router;


//    admin cart route will be defined for which it will be used to get all the cart items of all users and also to delete the cart items of all users.