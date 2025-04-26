import db from '../../../models/index.js';
const { User } = db;

// 👤 Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'name', 'email', 'phone_number', 'role', 'created_at']
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

