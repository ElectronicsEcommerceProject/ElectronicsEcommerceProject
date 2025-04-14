import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import { sequelize } from './config/db.js'; // Sequelize instance
// import authRoutes from './routes/authRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import couponRoutes from './routes/couponRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
// import wishlistRoutes from './routes/wishlistRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
// import stockAlertRoutes from './routes/stockAlertRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/stock-alerts', stockAlertRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Maa Laxmi Electronics Ecommerce API');
});

// Sync DB and Start Server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }) // Use alter: true only for development
  .then(() => {
    console.log('✅ Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
  });
