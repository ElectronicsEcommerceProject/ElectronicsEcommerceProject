import { DataTypes } from "sequelize";
import { deleteImage } from "../utils/imageUtils.js";

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
        // Will be overridden in beforeCreate hook for retailers
      },
      role: {
        type: DataTypes.ENUM("retailer", "customer", "admin"),
        allowNull: false,
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ban_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      as: "productReviews",
    });
    User.hasMany(models.CouponRedemption, {
      foreignKey: "user_id",
      as: "couponRedemptions",
    });

    User.hasMany(models.Notification, { foreignKey: "user_id" });
    User.hasMany(models.Notification, { foreignKey: "created_by" });
    User.hasMany(models.NotificationTemplate, { foreignKey: "created_by" });
    User.hasMany(models.NotificationTemplate, { foreignKey: "updated_by" });
  };

  // Add hook to set retailer status to inactive by default
  User.addHook('beforeCreate', async (user, options) => {
    if (user.role === 'retailer') {
      user.status = 'inactive';
    }
  });
  
  // Add hooks for automatic profile image cleanup
  User.addHook('beforeUpdate', async (user, options) => {
    try {
      // Check if profileImage_url is being changed
      if (user.changed('profileImage_url') && user._previousDataValues.profileImage_url) {
        const oldImageUrl = user._previousDataValues.profileImage_url;
        const newImageUrl = user.profileImage_url;

        // Only delete if the URL actually changed and old URL exists
        if (oldImageUrl !== newImageUrl && oldImageUrl) {
          deleteImage(oldImageUrl);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old profile image:', error);
    }
  });

  User.addHook('beforeDestroy', async (user, options) => {
    try {
      if (user.profileImage_url) {
        deleteImage(user.profileImage_url);
      }
    } catch (error) {
      console.error('Error cleaning up profile image on user deletion:', error);
    }
  });

  return User;
};
