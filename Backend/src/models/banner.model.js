import { DataTypes } from "sequelize";
import { deleteImage } from "../utils/imageUtils.js";

export default (sequelize) => {
  const Banner = sequelize.define(
    "Banner",
    {
      banner_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bg_class: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
      },
      button_text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      tableName: "Banners",
      timestamps: true,
      indexes: [
        { fields: ["is_active"] },
        { fields: ["display_order"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  Banner.associate = (models) => {
    Banner.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    Banner.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });
  };

  // Add hooks for automatic image cleanup
  Banner.addHook('beforeUpdate', async (banner, options) => {
    try {
      // Check if image_url is being changed
      if (banner.changed('image_url') && banner._previousDataValues.image_url) {
        const oldImageUrl = banner._previousDataValues.image_url;
        const newImageUrl = banner.image_url;
        
        // Only delete if the URL actually changed and old URL exists
        if (oldImageUrl !== newImageUrl && oldImageUrl) {
          deleteImage(oldImageUrl);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old banner image:', error);
    }
  });

  Banner.addHook('beforeDestroy', async (banner, options) => {
    try {
      if (banner.image_url) {
        deleteImage(banner.image_url);
      }
    } catch (error) {
      console.error('Error cleaning up banner image on deletion:', error);
    }
  });

  return Banner;
};