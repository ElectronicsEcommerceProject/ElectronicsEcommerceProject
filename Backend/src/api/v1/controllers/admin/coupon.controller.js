import db from '../../../../models/index.js'; // Import the database models

const { Coupon, User, Product } = db;

// 🎟️ Controller to create a new coupon
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount_percentage,
      valid_from,
      valid_until,
      target_role,
      is_user_specific = false,
      product_id
    } = req.body;

    // 🧑‍💼 Get admin user info from JWT
    const admin = await User.findOne({ where: { email: req.user.email, role: 'admin' } });
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Only admin can create coupons' });
    }

    // 🎯 Optional: Check if product exists (if product-specific coupon)
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found for this coupon' });
      }
    }

    const newCoupon = await Coupon.create({
      code,
      discount_percentage,
      valid_from,
      valid_until,
      target_role,
      is_user_specific,
      product_id,
      created_by: admin.user_id
    });

    res.status(201).json({ success: true, data: newCoupon });
  } catch (error) {
    console.error('❌ Error creating coupon:', error);
    res.status(500).json({ success: false, message: 'Failed to create coupon', error: error.message });
  }
};


export default { createCoupon};