import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Attribute = sequelize.define('Attribute', {
    attribute_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_type_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    data_type: { type: DataTypes.ENUM('string', 'int', 'float', 'enum'), allowNull: false },
    is_variant_level: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    updated_by: { type: DataTypes.INTEGER, allowNull: true }, // Changed to allowNull: true for consistency
  }, {
    timestamps: true,
    tableName: 'Attributes',
    indexes: [
      { fields: ['product_type_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  Attribute.associate = (models) => {
    Attribute.belongsTo(models.ProductType, { foreignKey: 'product_type_id' });
    Attribute.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    Attribute.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return Attribute;
};