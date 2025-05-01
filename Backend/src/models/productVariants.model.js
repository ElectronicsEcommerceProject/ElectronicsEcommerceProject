import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    variant_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: { type: DataTypes.UUID, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    sku: { type: DataTypes.STRING, allowNull: true },
    variant_image_url: { type: DataTypes.STRING, allowNull: true },
    discount_quantity: { type: DataTypes.INTEGER, allowNull: true },
    discount_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    min_retailer_quantity: { type: DataTypes.INTEGER, allowNull: true },
    bulk_discount_quantity: { type: DataTypes.INTEGER, allowNull: true },
    bulk_discount_percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
    updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
  }, {
    timestamps: true,
    tableName: 'ProductVariants',
    indexes: [
      { fields: ['product_id'] },
      { fields: ['sku'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, { foreignKey: 'product_id' });
    ProductVariant.hasMany(models.VariantAttributeValue, { foreignKey: 'variant_id' });
    ProductVariant.hasMany(models.ProductMedia, { foreignKey: 'variant_id' });
    ProductVariant.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    ProductVariant.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return ProductVariant;
};