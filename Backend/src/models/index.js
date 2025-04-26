import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import dbConfigFile from '../config/db.js';

dotenv.config({ path: '../.env' }); // Ensure the correct path to the .env file

const env = process.env.NODE_ENV || 'development';
const dbConfig = dbConfigFile[env];

// Debugging: Log the database configuration
// console.log('Database Configuration:', dbConfig);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = await import('./user.model.js').then(m => m.default(sequelize, Sequelize));
db.Category = await import('./category.model.js').then(m => m.default(sequelize, Sequelize));
db.Product = await import('./product.model.js').then(m => m.default(sequelize, Sequelize));
db.Coupon = await import('./coupon.model.js').then(m => m.default(sequelize, Sequelize));
db.CouponUser = await import('./couponUser.model.js').then(m => m.default(sequelize, Sequelize));
db.Order = await import('./order.model.js').then(m => m.default(sequelize, Sequelize));
db.OrderItem = await import('./orderItem.model.js').then(m => m.default(sequelize, Sequelize));
db.Cart = await import('./cart.model.js').then(m => m.default(sequelize, Sequelize));
db.Wishlist = await import('./wishlist.model.js').then(m => m.default(sequelize, Sequelize));
db.Review = await import('./review.model.js').then(m => m.default(sequelize, Sequelize));
db.StockAlert = await import('./stockAlert.model.js').then(m => m.default(sequelize, Sequelize));

// Define relationships
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Create tables from models
try {
  // await sequelize.sync({ alter: true }); // 
  console.log(' All tables created successfully !');
} catch (error) {
  console.error(' Error creating tables:', error);
}

export default db;