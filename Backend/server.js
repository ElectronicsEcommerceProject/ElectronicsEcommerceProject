import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stockAlertRoutes from './routes/stockAlertRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoute.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create uploads folder if not exists
const uploadsDir = path.join(__dirname, 'uploads/profile_images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load .env
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stock-alerts', stockAlertRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Welcome to Maa Laxmi Electronics Ecommerce API');
});

// ✅ Sync DB and Start Server
const { sequelize } = db;
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    await sequelize.sync(); // Remove { alter: true }
    // await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  }
})();
