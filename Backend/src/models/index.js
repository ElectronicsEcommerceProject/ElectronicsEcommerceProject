import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import dbConfigFile from "../config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - don't do this here as it's already loaded by Jest setup
// dotenv.config({ path: "../.env" });

const env = process.env.NODE_ENV || "development";
console.log(`Current environment: ${env}`); // Debug log

// Get database config for current environment
const dbConfig = dbConfigFile[env];

if (!dbConfig) {
  throw new Error(
    `Database configuration for environment "${env}" is missing.`
  );
}

// Log config for debugging
console.log("Database config:", {
  database: dbConfig.database,
  username: dbConfig.username,
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
});

// Initialize Sequelize
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
import User from "./user.model.js";
import Product from "./product.model.js";
import ProductVariant from "./productVariants.model.js";
import Attribute from "./productAttributes.model.js";
import AttributeValue from "./productAttributesValues.model.js";
import ProductMedia from "./productMedia.model.js";
import ProductMediaUrl from "./productMediaURL.model.js";
import Category from "./category.model.js";
import Brand from "./productBrand.model.js";
import Coupon from "./coupon.model.js";
import CouponUser from "./couponUser.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Cart from "./cart.model.js";
import CartItem from "./cartItem.model.js";
import Wishlist from "./wishlist.model.js";
import WishListItem from "./wishListItem.model.js";
import ProductReview from "./productReview.model.js";
import StockAlert from "./stockAlert.model.js";
import DiscountRule from "./discountRule.model.js";
import VariantAttributeValue from "./variantAttributeValue.model.js";
import Address from "./address.model.js";
import Owner from "./owner.model.js";
import CouponRedemption from "./couponRedemption.model.js";
import Store from "./store.model.js";
import Payment from "./payment.model.js";

// Initialize models
db.User = User(sequelize);
db.Product = Product(sequelize);
db.ProductVariant = ProductVariant(sequelize);
db.Attribute = Attribute(sequelize);
db.AttributeValue = AttributeValue(sequelize);
db.ProductMedia = ProductMedia(sequelize);
db.ProductMediaUrl = ProductMediaUrl(sequelize);
db.Category = Category(sequelize);
db.Brand = Brand(sequelize);
db.Coupon = Coupon(sequelize);
db.CouponUser = CouponUser(sequelize);
db.Order = Order(sequelize);
db.OrderItem = OrderItem(sequelize);
db.Cart = Cart(sequelize);
db.CartItem = CartItem(sequelize);
db.Wishlist = Wishlist(sequelize);
db.WishListItem = WishListItem(sequelize);
db.ProductReview = ProductReview(sequelize);
db.StockAlert = StockAlert(sequelize);
db.DiscountRule = DiscountRule(sequelize);
db.VariantAttributeValue = VariantAttributeValue(sequelize);
db.Address = Address(sequelize);
db.Owner = Owner(sequelize);
db.CouponRedemption = CouponRedemption(sequelize);
db.Store = Store(sequelize);
db.Payment = Payment(sequelize);

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (
    db[modelName].associate &&
    typeof db[modelName].associate === "function"
  ) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
export default db;