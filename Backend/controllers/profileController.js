// Get  profile

// Update profile

// Upload profile picture

// Change password

// View purchase history (for customers)


// ===============================All above Logic to write in this  file================================

import db from '../models/index.js'; // Import the database models

const { User } = db; // Extract the User model

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// For ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const { name, address, city, postal_code } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Update basic fields
    user.name = name || user.name;
    user.address = address || user.address;
    user.city = city || user.city;
    user.postal_code = postal_code || user.postal_code;

    // ✅ Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (user.profileImage_url && !user.profileImage_url.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // 🧹 delete old image
        }
      }

      // Save new image as full URL in DB
      const publicUrl = `${req.protocol}://${req.get('host')}/uploads/profile_images/${req.file.filename}`;
      user.profileImage_url = publicUrl;
    }

    // ✅ Save updates
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};