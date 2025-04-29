// VariantAttributeValue.js
export default (sequelize, DataTypes) => {
    const VariantAttributeValue = sequelize.define('VariantAttributeValue', {
      variant_attribute_value_id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
      variant_id: { type: DataTypes.UUID, allowNull: false },
      attribute_id: { type: DataTypes.UUID, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      timestamps: true,
      tableName: 'VariantAttributeValues',
      indexes: [
        { fields: ['variant_id'] },
        { fields: ['attribute_id'] },
        { fields: ['created_by'] },
        { fields: ['updated_by'] }
      ]
    });
  
    VariantAttributeValue.associate = (models) => {
      VariantAttributeValue.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
      VariantAttributeValue.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
    };
  
    return VariantAttributeValue;
  };
  