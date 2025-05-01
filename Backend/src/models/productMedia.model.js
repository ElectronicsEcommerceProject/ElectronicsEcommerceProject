import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize

export default (sequelize) => {
  const ProductMedia = sequelize.define('ProductMedia', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: { type: DataTypes.UUID, allowNull: false },
    variant_id: { type: DataTypes.UUID, allowNull: true },
    attribute_id: { type: DataTypes.UUID, allowNull: true },
    media_url: { type: DataTypes.STRING, allowNull: false },
    media_type: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' },
    created_by: { type: DataTypes.UUID, allowNull: false },
    updated_by: { type: DataTypes.UUID, allowNull: true },
  }, {
    indexes: [
      { fields: ['product_id'] },
      { fields: ['variant_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] }
    ]
  });

  ProductMedia.associate = (models) => {
    ProductMedia.belongsTo(models.Product, { foreignKey: 'product_id' });
    ProductMedia.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
    ProductMedia.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
  };

  return ProductMedia;
};