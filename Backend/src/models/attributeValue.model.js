const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const AttributeValue = sequelize.define('AttributeValue', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  attribute_id: { type: DataTypes.UUID, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.UUID, allowNull: false },
  updated_by: { type: DataTypes.UUID, allowNull: true },
}, {
  indexes: [
    { fields: ['attribute_id'] },
    { fields: ['value'] },
    { fields: ['created_by'] },
    { fields: ['updated_by'] }
  ]
});

AttributeValue.associate = (models) => {
  AttributeValue.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
};

module.exports = AttributeValue;
