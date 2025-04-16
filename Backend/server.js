import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/index.js'; // Import the db object
import authRoutes from './routes/authRoutes.js'; // Import the authRoutes

const { sequelize } = db; // Extract sequelize instance from db

// Load environment variables
dotenv.config({ path: './.env' }); // Ensure the path is correct

// // Debugging: Log environment variables
// console.log('Loaded Environment Variables:');
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Use the authRoutes for authentication-related routes

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Maa Laxmi Electronics Ecommerce API');
});

// Sync DB and Start Server
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models with the database
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
})();