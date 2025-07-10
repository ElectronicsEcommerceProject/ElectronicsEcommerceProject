// Change password (todo)
// View purchase history (todo)
// ===============================

import db from "../../../../../models/index.js";
const { User } = db;

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";
import { deleteImage } from "../../../../../utils/imageUtils.js";

// ✅ Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET /api/profile
const getProfileByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({
      where: { user_id: user_id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Format profile image URL
    let profileImage_url = user.profileImage_url;
    if (profileImage_url && !profileImage_url.startsWith("http")) {
      profileImage_url = `${req.protocol}://${req.get(
        "host"
      )}/${profileImage_url.replace(/\\/g, "/")}`;
    }

    res.status(StatusCodes.OK).json({
      user_id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      profileImage_url,
      status: user.status,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.error, error: error.message });
  }
};

// ✅ PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    console.log("Update profile request received:", {
      body: req.body,
      file: req.file ? "File received" : "No file",
      params: req.params,
    });

    const { name, email } = req.body;
    const { user_id } = req.params;

    // Find user by ID or email
    let user;
    if (user_id) {
      user = await User.findOne({
        where: { user_id: user_id },
        attributes: { exclude: ["password"] },
      });
    } else if (email) {
      user = await User.findOne({
        where: { email: email },
        attributes: { exclude: ["password"] },
      });
    }

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // ✅ Update text fields
    if (name) {
      user.name = name;
    }

    // ✅ Handle profile image
    if (req.file) {
      console.log("Processing uploaded file:", req.file.filename);
      console.log("Current user profile image URL:", user.profileImage_url);

      // Delete old image using utility function
      if (user.profileImage_url) {
        console.log("Attempting to delete old profile image:", user.profileImage_url);
        deleteImage(user.profileImage_url);
      }

      // Store only relative path in DB
      user.profileImage_url = `uploads/profile_images/${req.file.filename}`;
      console.log("New profile image URL:", user.profileImage_url);
    }

    await user.save();
    console.log("User profile updated successfully");

    // ✅ Convert path to full public URL before sending response
    if (user.profileImage_url && !user.profileImage_url.startsWith("http")) {
      user.profileImage_url = `${req.protocol}://${req.get(
        "host"
      )}/${user.profileImage_url.replace(/\\/g, "/")}`;
    }

    res.status(StatusCodes.OK).json({ message: MESSAGE.put.succ, user });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

export default {
  getProfileByUserId,
  updateProfile,
};
