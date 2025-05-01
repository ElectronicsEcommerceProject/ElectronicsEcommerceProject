
// ProductAttributeValue.js
export default (sequelize, DataTypes) => {
    const ProductAttributeValue = sequelize.define('ProductAttributeValue', {
      product_attribute_value_id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
      product_id: { type: DataTypes.UUID, allowNull: false },
      attribute_id: { type: DataTypes.UUID, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      timestamps: true,
      tableName: 'ProductAttributeValues',
      indexes: [
        { fields: ['product_id'] },
        { fields: ['attribute_id'] },
        { fields: ['created_by'] },
        { fields: ['updated_by'] }
      ]
    });
  
    ProductAttributeValue.associate = (models) => {
      ProductAttributeValue.belongsTo(models.Product, { foreignKey: 'product_id' });
      ProductAttributeValue.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
    };
  
    return ProductAttributeValue;
  };