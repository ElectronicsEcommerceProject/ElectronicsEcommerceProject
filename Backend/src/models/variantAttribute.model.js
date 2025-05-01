const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const VariantAttributeValue = sequelize.define('VariantAttributeValue', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  variant_id: { type: DataTypes.UUID, allowNull: false },
  attribute_id: { type: DataTypes.UUID, allowNull: false },
  attribute_value_id: { type: DataTypes.UUID, allowNull: false },
}, {
  indexes: [
    { fields: ['variant_id'] },
    { fields: ['attribute_id'] },
    { fields: ['attribute_value_id'] }
  ]
});

VariantAttributeValue.associate = (models) => {
  VariantAttributeValue.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
  VariantAttributeValue.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
  VariantAttributeValue.belongsTo(models.AttributeValue, { foreignKey: 'attribute_value_id' });
};

module.exports = VariantAttributeValue;
