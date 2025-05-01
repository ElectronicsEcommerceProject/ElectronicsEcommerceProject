import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AttributeValue = sequelize.define('AttributeValue', {
    attribute_value_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    attribute_id: { type: DataTypes.UUID, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false },
    created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
    updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
  }, {
    timestamps: true,
    tableName: 'AttributeValues',
    indexes: [
      { fields: ['attribute_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  AttributeValue.associate = (models) => {
    AttributeValue.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
    AttributeValue.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    AttributeValue.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return AttributeValue;
};