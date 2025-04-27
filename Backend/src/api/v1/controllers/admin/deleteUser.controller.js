import db from '../../../models/index.js';
const { User } = db;


// ❌ Delete user by ID (Admin only)
const deleteUser = async (req, res) => {
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

export default deleteUser;