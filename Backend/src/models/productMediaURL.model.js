import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductMediaURL = sequelize.define(
    "ProductMediaURL",
    {
      product_media_url_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_media_id: { type: DataTypes.UUID, allowNull: false },
      product_media_url: { type: DataTypes.STRING, allowNull: false },
      media_type: {
        type: DataTypes.ENUM("image", "video"),
        defaultValue: "image",
      },
      created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
      updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
    },
    {
      tableName: "ProductMediaURL",
      timestamps: true,
      indexes: [
        { fields: ["product_media_url_id"] },
        { fields: ["product_media_id"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  ProductMediaURL.associate = (models) => {
    ProductMediaURL.belongsTo(models.ProductMedia, {
      foreignKey: "product_media_id",
    });
    ProductMediaURL.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    ProductMediaURL.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });
  };

  return ProductMediaURL;
};
