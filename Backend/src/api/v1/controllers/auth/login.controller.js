import bcrypt from "bcrypt";
import db from "../../../../models/index.js"; // Import the database models
const { User } = db; // Extract the User model
import {
  encodeJwtToken,
  verifyJwtToken,
} from "../../../../middleware/jwt.middleware.js";
import MESSAGE from "../../../../constants/message.js";
import { StatusCodes } from "http-status-codes";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.none,
      });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: MESSAGE.custom("Invalid password."),
      });
    }

    // Generate JWT token
    const token = encodeJwtToken(email, user.user_id, user.role);

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.custom("Login successful"),
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.error,
      error,
    });
  }
};

export default login;
