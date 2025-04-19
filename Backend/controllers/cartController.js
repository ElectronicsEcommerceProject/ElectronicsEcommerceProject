import db from '../models/index.js';

const { Cart, Product, User } = db;

// ✅ Add to cart (or update if already exists)
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ message: 'Product ID and quantity are required' });

    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });    

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const [cartItem, created] = await Cart.findOrCreate({
      where: { user_id: user.user_id, product_id },
      defaults: { quantity }
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    res.status(200).json({ message: 'Product added to cart', cartItem });
  } catch (err) {
    console.error("❌ Error in addToCart:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Get user's cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const cartItems = await Cart.findAll({
      where: { user_id: user.user_id },
      include: [{ model: Product }]
    });

    res.status(200).json(cartItems);
  } catch (err) {
    console.error("❌ Error in getCart:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const user = await User.findOne({ where: { email: req.user.email } });
    const cartItem = await Cart.findOne({ where: { user_id: user.user_id, product_id } });

    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart item updated', cartItem });
  } catch (err) {
    console.error("❌ Error in updateCartItem:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });

    const cartItem = await Cart.findOne({ where: { user_id: user.user_id, product_id } });
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });

    await cartItem.destroy();

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error("❌ Error in removeFromCart:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
