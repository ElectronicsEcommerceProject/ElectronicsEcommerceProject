import { DataTypes } from "sequelize";
import { deleteImages } from "../utils/imageUtils.js";

export default (sequelize) => {
  const ProductMedia = sequelize.define(
    "ProductMedia",
    {
      product_media_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_id: { type: DataTypes.UUID, allowNull: false },
      product_variant_id: { type: DataTypes.UUID, allowNull: true },
      media_type: {
        type: DataTypes.ENUM("image", "video"),
        defaultValue: "image",
      },
      created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
      updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
    },
    {
      tableName: "ProductMedia",
      timestamps: true,
      indexes: [
        { fields: ["product_id"] },
        { fields: ["product_variant_id"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  ProductMedia.associate = (models) => {
    ProductMedia.hasMany(models.ProductMediaUrl, {
      foreignKey: "product_media_id",
      as: "productMediaUrl",
      onDelete: "CASCADE"
    });

    ProductMedia.belongsTo(models.Product, { foreignKey: "product_id" });

    ProductMedia.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
    });
    ProductMedia.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    ProductMedia.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });
  };

  // Add hooks for automatic image cleanup
  ProductMedia.addHook('beforeDestroy', async (media, options) => {
    try {
      // Get all related media URLs before deletion
      const mediaWithUrls = await ProductMedia.findByPk(media.product_media_id, {
        include: [{
          model: sequelize.models.ProductMediaUrl,
          as: "productMediaUrl",
          attributes: ["product_media_url"]
        }]
      });

      if (mediaWithUrls && mediaWithUrls.productMediaUrl) {
        const imagesToDelete = mediaWithUrls.productMediaUrl
          .map(url => url.product_media_url)
          .filter(url => url);

        deleteImages(imagesToDelete);
      }
    } catch (error) {
      console.error('Error cleaning up media images:', error);
    }
  });

  return ProductMedia;
};
