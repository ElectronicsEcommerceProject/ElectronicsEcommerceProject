const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const Brand = sequelize.define('Brand', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, unique: true },
  created_by: { type: DataTypes.UUID, allowNull: false },
  updated_by: { type: DataTypes.UUID, allowNull: true },
}, {
  indexes: [
    { fields: ['name'] },
    { fields: ['slug'] },
    { fields: ['created_by'] },
    { fields: ['updated_by'] }
  ]
});

module.exports = Brand;
