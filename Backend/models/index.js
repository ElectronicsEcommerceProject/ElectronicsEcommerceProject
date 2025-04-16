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
db.User = await import('./userModel.js').then(m => m.default(sequelize, Sequelize));
db.Category = await import('./categoryModel.js').then(m => m.default(sequelize, Sequelize));
db.Product = await import('./productModel.js').then(m => m.default(sequelize, Sequelize));
db.Coupon = await import('./couponModel.js').then(m => m.default(sequelize, Sequelize));
db.CouponUser = await import('./couponUserModel.js').then(m => m.default(sequelize, Sequelize));
db.Order = await import('./orderModel.js').then(m => m.default(sequelize, Sequelize));
db.OrderItem = await import('./orderItemModel.js').then(m => m.default(sequelize, Sequelize));
db.Cart = await import('./cartModel.js').then(m => m.default(sequelize, Sequelize));
db.Wishlist = await import('./wishlistModel.js').then(m => m.default(sequelize, Sequelize));
db.Review = await import('./reviewModel.js').then(m => m.default(sequelize, Sequelize));
db.StockAlert = await import('./stockAlertModel.js').then(m => m.default(sequelize, Sequelize));

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