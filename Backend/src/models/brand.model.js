import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Brand = sequelize.define('Brand', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, unique: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    updated_by: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'Brands', // Added explicit tableName
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['slug'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  Brand.associate = (models) => {
    Brand.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    Brand.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
    Brand.hasMany(models.Product, { foreignKey: 'brand_id' });
  };

  return Brand;
};