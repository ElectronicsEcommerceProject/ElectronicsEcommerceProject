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
          "If your email is registered, you will receive a password reset OTP",
      });
    }

    // Generate a 4-digit OTP
    const resetOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Set OTP expiration (15 minutes from now)
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Store OTP in database
    await user.update({
      reset_token: resetOTP,
      reset_token_expires: resetTokenExpires,
    });

    // Send email with OTP
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please use the 4-digit OTP below:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">${resetOTP}</div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This OTP will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${email}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset OTP has been sent to your email",
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
    const { otp, password } = req.body;

    console.log("Attempting password reset with OTP:", otp);

    // Find user with this OTP and check if OTP is still valid
    const user = await User.findOne({
      where: {
        reset_token: otp,
        reset_token_expires: {
          [Sequelize.Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      console.log("No user found with valid OTP:", otp);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    console.log("User found with valid OTP:", user.email);

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
