import bcrypt from 'bcrypt';
import db from '../models/index.js'; // Import the database models
const { User } = db; // Extract the User model
import { encodeJwtToken, verifyJwtToken } from '../middleware/jwt.js';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide both email and password.'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate JWT token
    const token = encodeJwtToken(email,user.role);

    // Create response object without password
    const response = {
      token
    };

    res.status(200).json({ 
      message: 'User logged in successfully!',
      data: response
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


