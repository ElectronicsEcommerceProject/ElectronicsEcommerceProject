import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const VariantAttributeValue = sequelize.define('VariantAttributeValue', {
    variant_attribute_value_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_variant_id: { type: DataTypes.UUID, allowNull: false },
    product_attribute_id: { type: DataTypes.UUID, allowNull: false },
    product_attribute_value_id: { type: DataTypes.STRING, allowNull: false },
    created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
    updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
  }, {
    timestamps: true,
    tableName: 'VariantAttributeValues',
    indexes: [
      { fields: ['product_variant_id'] },
      { fields: ['product_attribute_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  VariantAttributeValue.associate = (models) => {
    VariantAttributeValue.belongsTo(models.ProductVariant, { foreignKey: 'product_variant_id' });
    VariantAttributeValue.belongsTo(models.Attribute, { foreignKey: 'product_attribute_id' });
    VariantAttributeValue.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    VariantAttributeValue.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return VariantAttributeValue;
};