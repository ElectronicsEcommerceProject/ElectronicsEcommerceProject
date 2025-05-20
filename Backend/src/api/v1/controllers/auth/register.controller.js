import bcrypt from "bcrypt";
import db from "../../../../models/index.js"; // Import the database models
import services from "../../../../services/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";
const { User } = db; // Extract the User model
import {sendWelcomeNotification } from "../../../../services/notification/welcome/welcome.js";

const register = async (req, res) => {
  try {
    const { name, email, phone_number, password, role } = req.body;

    // Check if the user already exists (only after validation passes)
    const existingUser = await services.auth.isEmailOrPhoneRegistered(
      email,
      phone_number
    );
    if (existingUser) {
      if (existingUser.field === "email") {
        return res.status(StatusCodes.CONFLICT).json({
          message: MESSAGE.custom("User already exists with this email."),
        });
      } else if (existingUser.field === "phone") {
        return res.status(StatusCodes.CONFLICT).json({
          message: MESSAGE.custom(
            "User already exists with this phone_number."
          ),
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      role, // Ensure role is saved
      profileImage_url:`https://api.dicebear.com/5.x/initials/svg?seed=${name}`,  
    }); 

    // Exclude password from the response for security
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    // Send welcome notification
    
    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      user: userResponse,
    });

    

  } catch (error) {
    console.error("Error during registration:", error);
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: MESSAGE.custom("Validation Error"),
        errors: messages,
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.error,
    });
  }
};

export default register;
