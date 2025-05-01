import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import dbConfigFile from '../config/db.js';

dotenv.config({ path: '../.env' });

const env = process.env.NODE_ENV || 'development';
const dbConfig = dbConfigFile[env];

if (!dbConfig) {
  throw new Error(`Database configuration for environment "${env}" is missing.`);
}

// ✅ Initialize Sequelize
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

// Import models
db.ProductType = (await import('./productType.model.js')).default(sequelize);
db.Attribute = (await import('./attributes.model.js')).default(sequelize);
db.AttributeValue = (await import('./attributeValue.model.js')).default(sequelize);
db.Product = (await import('./product.model.js')).default(sequelize);
db.ProductVariant = (await import('./productVariants.model.js')).default(sequelize);
db.ProductMedia = (await import('./productMedia.model.js')).default(sequelize);
db.ProductReview = (await import('./productReview.model.js')).default(sequelize);
db.Category = (await import('./category.model.js')).default(sequelize);
db.Brand = (await import('./brand.model.js')).default(sequelize);
db.Coupon = (await import('./coupon.model.js')).default(sequelize);
db.CouponUser = (await import('./couponUser.model.js')).default(sequelize);
db.Order = (await import('./order.model.js')).default(sequelize);
db.OrderItem = (await import('./orderItem.model.js')).default(sequelize);
db.Cart = (await import('./cart.model.js')).default(sequelize);
db.Wishlist = (await import('./wishlist.model.js')).default(sequelize);
db.Review = (await import('./review.model.js')).default(sequelize);
db.StockAlert = (await import('./stockAlert.model.js')).default(sequelize);
db.DiscountRule = (await import('./discountRule.model.js')).default(sequelize);
db.VariantAttributeValue = (await import('./variantAttribute.model.js')).default(sequelize);
db.User = (await import('./user.model.js')).default(sequelize);
db.CouponRedemption = (await import('./couponRedemption.model.js')).default(sequelize);

// Define relationships
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // ✅ Add Sequelize instance to db object
export default db;