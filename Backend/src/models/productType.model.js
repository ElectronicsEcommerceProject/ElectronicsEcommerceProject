import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductType = sequelize.define('ProductType', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'ProductTypes',
    timestamps: true,
  });

  ProductType.associate = (models) => {
    ProductType.hasMany(models.Attribute, { foreignKey: 'product_type_id' });
  };

  return ProductType;
};