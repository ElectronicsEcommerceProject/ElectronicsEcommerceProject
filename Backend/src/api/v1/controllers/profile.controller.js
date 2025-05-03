// ===============================
// Get profile
// Update profile
// Upload profile picture
// Change password (todo)
// View purchase history (todo)
// ===============================

import db from '../../../models/index.js';
const { User } = db;

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { StatusCodes } from 'http-status-codes';
import MESSAGE from '../../../constants/message.js';

// ✅ Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Convert stored relative path to full URL for frontend
    if (user.profileImage_url && !user.profileImage_url.startsWith('http')) {
      user.profileImage_url = `${req.protocol}://${req.get('host')}/${user.profileImage_url.replace(/\\/g, '/')}`;
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.error, error: error.message });
  }
};

// ✅ PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { name, address, city, postal_code, email } = req.body;

    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ['password']},

    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // ✅ Update text fields
    user.name = name || user.name;
    user.address = address || user.address;
    user.city = city || user.city;
    user.postal_code = postal_code || user.postal_code;

    // ✅ Handle profile image
    if (req.file) {
      // Delete old image if stored as relative path
      if (user.profileImage_url && !user.profileImage_url.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑 Old profile image deleted:', oldImagePath);
        }
      }

      // Store only relative path in DB
      user.profileImage_url = `uploads/profile_images/${req.file.filename}`;
    }

    await user.save();

    // ✅ Convert path to full public URL before sending response
    if (user.profileImage_url && !user.profileImage_url.startsWith('http')) {
      user.profileImage_url = `${req.protocol}://${req.get('host')}/${user.profileImage_url.replace(/\\/g, '/')}`;
    }

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, user });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

export default {
  getProfile,
  updateProfile,
};