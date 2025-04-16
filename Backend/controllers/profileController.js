// Get  profile

// Update profile

// Upload profile picture

// Change password

// View purchase history (for customers)


// ===============================All above Logic to write in this  file================================

import db from '../models/index.js'; // Import the database models

const { User } = db; // Extract the User model

// GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.user.email },
            attributes: ['name', 'email', 'phone_number', 'role', 'created_at']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// PUT /api/profile
// export const updateProfile = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = await User.findByPk(req.user.id);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.name = name || user.name;
//     await user.save();

//     res.json({ message: 'Profile updated', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };
