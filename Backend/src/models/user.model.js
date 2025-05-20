import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      profileImage_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      current_address_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "banned"),
        defaultValue: "active",
      },
      role: {
        type: DataTypes.ENUM("retailer", "customer", "admin"),
        allowNull: false,
      },
      lastActive: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      paranoid: true, // enable soft delete
      timestamps: true,
      tableName: "Users",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Product, { foreignKey: "created_by", as: "products" });
    User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
    User.hasMany(models.Cart, { foreignKey: "user_id", as: "carts" });
    User.hasMany(models.Wishlist, { foreignKey: "user_id", as: "wishlists" });
    User.hasMany(models.Address, { foreignKey: "user_id", as: "addresses" });
    User.hasMany(models.ProductReview, {
      foreignKey: "user_id",
      as: "reviews",
    });
    User.hasMany(models.CouponRedemption, {
      foreignKey: "user_id",
      as: "couponRedemptions",
    });
  };

  return User;
};
