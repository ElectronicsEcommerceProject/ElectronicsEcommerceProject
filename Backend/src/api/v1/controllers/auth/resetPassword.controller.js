import bcrypt from "bcrypt";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
import { Sequelize } from "sequelize";

dotenv.config();
const { User } = db;

// Configure nodemailer with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Request password reset (forgot password)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(StatusCodes.OK).json({
        success: true,
        message:
          "If your email is registered, you will receive a password reset token",
      });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token expiration (24 hours from now)
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store token in database
    await user.update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpires,
    });

    // Send email with just the token
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset Token",
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please copy the token below and paste it in the reset form:</p>
        <p><strong>${resetToken}</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This token will expire in 24 hours.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${email}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset token has been sent to your email",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    console.log("Attempting password reset with token:", token);

    // Find user with this token and check if token is still valid
    let user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expires: {
          [Sequelize.Op.gt]: new Date(),
        },
      },
    });

    // If no user found, try just finding by token (for debugging)
    if (!user) {
      console.log("Trying fallback query with just token");
      user = await User.findOne({
        where: { reset_token: token },
      });

      if (user) {
        console.log(
          "User found by token only. Token expiry:",
          user.reset_token_expires
        );
        console.log("Current time:", new Date());

        // Check if token is expired
        if (new Date(user.reset_token_expires) <= new Date()) {
          console.log("Token is expired");
          user = null;
        }
      }
    }

    if (!user) {
      console.log("No user found with valid token:", token);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    console.log("User found with valid token:", user.email);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token fields
    await user.update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

export default {
  forgotPassword,
  resetPassword,
};
