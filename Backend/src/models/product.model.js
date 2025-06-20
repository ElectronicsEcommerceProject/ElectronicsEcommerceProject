import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      short_description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      rating_average: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0.0,
      },
      rating_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      // paranoid: true, // soft delete to preserve sales history
      tableName: "Products",
      indexes: [
        { fields: ["category_id"] },
        { fields: ["brand_id"] },
        { fields: ["created_by"] },
        { fields: ["slug"] },
        {
          // Specify key length for TEXT columns
          fields: [
            "name",
            { attribute: "description", length: 255 },
            { attribute: "short_description", length: 255 },
          ],
          // type: "FULLTEXT",
        },
      ],
    }
  );

  Product.associate = (models) => {
    // Define associations
    Product.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
    Product.belongsTo(models.Brand, { foreignKey: "brand_id", as: "brand" });
    Product.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
    Product.hasMany(models.ProductVariant, {
      foreignKey: "product_id",
      as: "variants",
    });
    Product.hasMany(models.ProductMedia, {
      foreignKey: "product_id",
      as: "media",
    });
    Product.hasMany(models.ProductReview, {
      foreignKey: "product_id",
      as: "reviews",
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: "product_id",
      as: "orderItems",
    });
    Product.hasMany(models.CartItem, {
      foreignKey: "product_id",
      as: "cartItems",
    });
    Product.hasMany(models.WishListItem, {
      foreignKey: "product_id",
      as: "wishlistItems",
    });
    Product.hasMany(models.Coupon, {
      foreignKey: "product_id",
      as: "coupons",
    });
    Product.hasMany(models.DiscountRule, {
      foreignKey: "product_id",
      as: "discountRules",
    });
    Product.hasMany(models.StockAlert, {
      foreignKey: "product_id",
      as: "stockAlerts",
    });
  };

  return Product;
};
