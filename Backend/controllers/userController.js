import db from '../models/index.js';
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

// ❌ Delete user by ID (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
