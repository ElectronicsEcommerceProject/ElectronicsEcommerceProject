import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import dbConfigFile from "../config/db.js";

dotenv.config({ path: "../.env" });

const env = process.env.NODE_ENV || "development";
const dbConfig = dbConfigFile[env];

if (!dbConfig) {
  throw new Error(
    `Database configuration for environment "${env}" is missing.`
  );
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
db.ProductType = (await import("./productType.model.js")).default(sequelize);
db.Attribute = (await import("./productAttributes.model.js")).default(
  sequelize
);
db.AttributeValue = (
  await import("./productAttributesValues.model.js")
).default(sequelize);
db.Product = (await import("./product.model.js")).default(sequelize);
db.ProductVariant = (await import("./productVariants.model.js")).default(
  sequelize
);
// Define a junction table for the many-to-many relationship if it doesn't exist as a model
db.VariantAttributeValue = sequelize.define(
  "VariantAttributeValue",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_variant_id: {
      type: DataTypes.UUID,
      references: {
        model: "ProductVariants",
        key: "product_variant_id",
      },
    },
    attribute_value_id: {
      type: DataTypes.UUID,
      references: {
        model: "AttributeValues",
        key: "id",
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "VariantAttributeValues",
    timestamps: true,
  }
);
db.ProductMedia = (await import("./productMedia.model.js")).default(sequelize);
db.ProductReview = (await import("./productReview.model.js")).default(
  sequelize
);
db.Category = (await import("./category.model.js")).default(sequelize);
db.Brand = (await import("./brand.model.js")).default(sequelize);
db.Coupon = (await import("./coupon.model.js")).default(sequelize);
db.CouponUser = (await import("./couponUser.model.js")).default(sequelize);
db.Order = (await import("./order.model.js")).default(sequelize);
db.OrderItem = (await import("./orderItem.model.js")).default(sequelize);
db.Cart = (await import("./cart.model.js")).default(sequelize);
db.CartItem = (await import("./cartItem.model.js")).default(sequelize);
db.Wishlist = (await import("./wishlist.model.js")).default(sequelize);
db.WishListItem = (await import("./wishListItem.model.js")).default(sequelize);
db.Review = (await import("./review.model.js")).default(sequelize);
db.StockAlert = (await import("./stockAlert.model.js")).default(sequelize);
db.DiscountRule = (await import("./discountRule.model.js")).default(sequelize);
db.VariantAttributeValue = (
  await import("./variantAttribute.model.js")
).default(sequelize);
db.User = (await import("./user.model.js")).default(sequelize);
db.Address = (await import("./address.model.js")).default(sequelize);
db.Owner = (await import("./owner.model.js")).default(sequelize);
db.CouponRedemption = (await import("./couponRedemption.model.js")).default(
  sequelize
);

db.Store = (await import("./store.model.js")).default(sequelize);

// // After importing all models, make sure they're all defined before setting up associations
// console.log("Available models:", Object.keys(db));

// Then set up associations
Object.keys(db).forEach((modelName) => {
  if (
    db[modelName].associate &&
    typeof db[modelName].associate === "function"
  ) {
    // console.log(`Setting up associations for ${modelName}`);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // ✅ Add Sequelize instance to db object
export default db;
