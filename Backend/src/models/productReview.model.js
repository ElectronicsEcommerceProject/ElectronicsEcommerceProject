import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductReview = sequelize.define(
    "ProductReview",
    {
      product_review_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_id: { type: DataTypes.UUID, allowNull: false },
      product_variant_id: { type: DataTypes.UUID, allowNull: true },
      user_id: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      title: { type: DataTypes.STRING, allowNull: true },
      review: { type: DataTypes.TEXT, allowNull: true },
      is_verified_purchase: { type: DataTypes.BOOLEAN, defaultValue: false },
      review_action: {
        type: DataTypes.ENUM("pending", "approve", "reject", "flag"),
        defaultValue: "pending",
      },
      created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
      updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
    },
    {
      tableName: "ProductReviews",
      timestamps: true,
      indexes: [
        { fields: ["product_id"] },
        { fields: ["product_variant_id"] },
        { fields: ["user_id"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  ProductReview.associate = (models) => {
    ProductReview.belongsTo(models.Product, { foreignKey: "product_id" });
    ProductReview.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
    });
    ProductReview.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "reviewer",
    });
    ProductReview.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    ProductReview.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });
  };

  return ProductReview;
};
