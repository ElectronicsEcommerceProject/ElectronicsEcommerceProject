import db from "../../models/index.js";
const { User } = db;

import { Op } from "sequelize";
// Function to check if an email is already registered
const isRegisteredEmail = async (email) => {
  try {
    if (!email) return false; // If no email is provided, return false
    const existingUser = await User.findOne({ email });
    return !!existingUser; // Returns true if email exists, false otherwise
  } catch (error) {
    console.error("Error checking email registration:", error);
    // return false; // Return false in case of an error
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Function to check if a phone number is already registered
const isRegisteredPhoneNumber = async (phone) => {
  try {
    if (!phone) return false; // If no phone is provided, return false
    const existingUser = await User.findOne({ phone });
    return !!existingUser; // Returns true if phone exists, false otherwise
  } catch (error) {
    console.error("Error checking phone registration:", error);
    // return false; // Return false in case of an error
    throw error;
  }
};

const isRegisteredUser = async (userId) => {
  try {
    if (!userId) return false; // If no userId is provided, return false
    const existingUser = await User.findOne({ userId });
    return !!existingUser; // Returns true if userId exists, false otherwise
  } catch (error) {
    console.error("Error checking user registration:", error);
    // return false; // Return false in case of an error
    throw error; // Rethrow the error for handling in the calling function
  }
};

/**
 * Checks if either email or phone number is already registered
 * @param {string} email - Email to check
 * @param {string} phone - Phone number to check
 * @returns {Object|false} Returns { field: 'email'|'phone', exists: true } if found, false otherwise
 */
const isEmailOrPhoneRegistered = async (email, phone) => {
  try {
    if (!email && !phone) return false; // If neither email nor phone is provided, return false

    // First check if email exists
    if (email) {
      const emailExists = await User.findOne({
        where: { email: email },
      });

      if (emailExists) {
        return { field: "email", exists: true };
      }
    }

    // Then check if phone exists
    if (phone) {
      const phoneExists = await User.findOne({
        where: { phone_number: phone },
      });

      if (phoneExists) {
        return { field: "phone", exists: true };
      }
    }

    // If neither exists
    return false;
  } catch (error) {
    console.error("Error checking email or phone registration:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export default {
  isRegisteredEmail,
  isRegisteredPhoneNumber,
  isRegisteredUser,
  isEmailOrPhoneRegistered,
};
