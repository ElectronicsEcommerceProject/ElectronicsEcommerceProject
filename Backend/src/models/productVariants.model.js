import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductVariant = sequelize.define(
    "ProductVariant",
    {
      product_variant_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      description: { type: DataTypes.STRING, allowNull: true },
      short_description: { type: DataTypes.STRING, allowNull: true },
      product_id: { type: DataTypes.UUID, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sku: { type: DataTypes.STRING, allowNull: true },
      base_variant_image_url: { type: DataTypes.STRING, allowNull: true },
      discount_quantity: { type: DataTypes.INTEGER, allowNull: true },
      discount_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
      min_retailer_quantity: { type: DataTypes.INTEGER, allowNull: true },
      bulk_discount_quantity: { type: DataTypes.INTEGER, allowNull: true },
      bulk_discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      created_by: { type: DataTypes.UUID, allowNull: false },
      updated_by: { type: DataTypes.UUID, allowNull: true },
    },
    {
      timestamps: true,
      tableName: "ProductVariants",
      // paranoid: true, // preserve past variant sales
      indexes: [
        { fields: ["product_id"] },
        { fields: ["sku"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  ProductVariant.associate = (models) => {
    // Relationship with Product
    ProductVariant.belongsTo(models.Product, { foreignKey: "product_id" });

    // Now we can add the correct association
    // The model is called 'AttributeValue' (confirmed from the logs)
    ProductVariant.belongsToMany(models.AttributeValue, {
      through: models.VariantAttributeValue,
      foreignKey: "product_variant_id",
      otherKey: "product_attribute_value_id",
      uniqueKey: "var_attr_val", // Match the same uniqueKey name
    });

    // Relationship with ProductMedia
    ProductVariant.hasMany(models.ProductMedia, {
      foreignKey: "product_variant_id",
    });

    // Relationships with User for created_by and updated_by
    ProductVariant.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    ProductVariant.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });

    // Add other relationships
    ProductVariant.hasMany(models.CartItem, {
      foreignKey: "product_variant_id",
    });
    ProductVariant.hasMany(models.ProductReview, {
      foreignKey: "product_variant_id",
    });
  };

  return ProductVariant;
};
