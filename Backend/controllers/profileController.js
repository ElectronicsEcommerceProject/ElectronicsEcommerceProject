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
            attributes: { exclude: ['password'] } // Return all attributes except password
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
export const updateProfile = async (req, res) => {
    try {
      const { name, address, city, postal_code, profileImage_url } = req.body;
  
      const user = await User.findOne({
        where: { email: req.user.email },
        attributes: [
          'user_id', // 👈 Primary key added here!
          'name',
          'email',
          'phone_number',
          'role',
          'address',
          'city',
          'postal_code',
          'profileImage_url',
          'created_at'
        ]
      });
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.name = name || user.name;
      user.address = address || user.address;
      user.city = city || user.city;
      user.postal_code = postal_code || user.postal_code;
      user.profileImage_url = profileImage_url || user.profileImage_url;

      console.log("testing",req.body)
  
      await user.save();
  
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  };