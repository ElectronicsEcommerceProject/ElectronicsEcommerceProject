import bcrypt from 'bcrypt';
import db from '../../../../models/index.js'; // Import the database models
import services from '../../../../services/index.js';
const { User } = db; // Extract the User model


const register = async (req, res) => {
  try {
    const { name, email, phone_number, password, role } = req.body;

    // --- Input Validation Start ---
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phone_number) missingFields.push('phone_number');
    if (!password) missingFields.push('password'); // Added password check as it's essential
    if (!role) missingFields.push('role');

    if (missingFields.length > 0) {
      // If any required field is missing (null, undefined, empty string)
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}. Please provide all required information.`
      });
    }
    // --- Input Validation End ---

    // Check if the user already exists (only after validation passes)
    const existingUser = await services.auth.isEmailOrPhoneRegistered(email, phone_number);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    // Check if the user already exists (only after validation passes)
    const existingPhoneNumber = await User.findOne({ where: { phone_number } });
    if (existingPhoneNumber) {
      return res.status(400).json({ message: 'User already exists with this phone_number.' });
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
    });

    // Exclude password from the response for security
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;


    res.status(201).json({ message: 'User registered successfully!', user: userResponse });
  } catch (error) {
    console.error('Error during registration:', error);
    // Check for specific Sequelize validation errors (optional but good)
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default register;
