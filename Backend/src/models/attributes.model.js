
// Attribute.js
export default (sequelize, DataTypes) => {
    const Attribute = sequelize.define('Attribute', {
      attribute_id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
      product_type_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      data_type: { type: DataTypes.ENUM('string', 'int', 'float', 'enum'), allowNull: false },
      is_variant_level: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      timestamps: true,
      tableName: 'Attributes',
      indexes: [
        { fields: ['product_type_id'] },
        { fields: ['created_by'] },
        { fields: ['updated_by'] }
      ]
    });
  
    Attribute.associate = (models) => {
      Attribute.belongsTo(models.ProductType, { foreignKey: 'product_type_id' });
    };
  
    return Attribute;
  };
  
  
  