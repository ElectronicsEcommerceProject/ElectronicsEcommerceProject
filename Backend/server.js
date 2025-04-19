import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/index.js'; // Import the db object
import authRoutes from './routes/authRoutes.js'; // Import the authRoutes
import profileRoutes from './routes/profileRoutes.js'; // Import the profileRoutes
import categoryRoutes from './routes/categoryRoutes.js'; // Import the categoryRoutes
const { sequelize } = db; // Extract sequelize instance from db
import productRoutes from './routes/productRoutes.js'; // Import the productRoutes
import cartRoutes from './routes/cartRoutes.js'; // Import the cartRoutes
import orderRoutes from './routes/orderRoutes.js'; 
import stockAlertRoutes from './routes/stockAlertRoutes.js'; // Import the stockAlertRoutes
import wishlistRoutes from './routes/wishlistRoutes.js'; // Import the wishlistRoutes

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
app.use('/api/profile', profileRoutes); // Use the profileRoutes for profile-related routes
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes); // Use the productRoutes for product-related routes
app.use('/api/cart', cartRoutes); // Use the cartRoutes for cart-related routes
app.use('/api/orders', orderRoutes); // Use the orderRoutes for order-related routes
app.use('/api/stock-alerts', stockAlertRoutes); // Use the stockAlertRoutes for stock alert-related routes
app.use('/api/wishlist', wishlistRoutes); // Use the wishlistRoutes for wishlist-related routes


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

    // await sequelize.sync({ force: true });


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