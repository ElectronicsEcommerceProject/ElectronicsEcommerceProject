import db from '../../../../models/index.js'; // Import the database models
const { Wishlist, Product, User } = db;

// ✅ Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

    const user = await User.findOne({ where: { email: req.user.email } });
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Wishlist.findOne({
      where: { user_id: user.user_id, product_id }
    });

    if (existing) {
      return res.status(200).json({ message: 'Product already in wishlist' });
    }

    const wishlist = await Wishlist.create({
      user_id: user.user_id,
      product_id
    });

    res.status(201).json({ message: 'Product added to wishlist', wishlist });
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    const wishlist = await Wishlist.findAll({
      where: { user_id: user.user_id },
      include: [{ model: Product }]
    });

    res.status(200).json(wishlist);
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });

    const item = await Wishlist.findOne({
      where: { user_id: user.user_id, product_id }
    });

    if (!item) return res.status(404).json({ message: 'Item not found in wishlist' });

    await item.destroy();

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error("❌ Error removing from wishlist:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export default {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};