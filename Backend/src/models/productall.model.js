// Product.js
import { v4 as uuidv4 } from 'uuid';

export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    thumbnail_url: { type: DataTypes.STRING, allowNull: true },
    base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    product_type_id: { type: DataTypes.INTEGER, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    updated_by: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    timestamps: true,
    tableName: 'Products',
    indexes: [
      { fields: ['category_id'] },
      { fields: ['product_type_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] }
    ]
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.ProductType, { foreignKey: 'product_type_id' });
    Product.belongsTo(models.User, { foreignKey: 'created_by' });
    Product.hasMany(models.ProductVariant, { foreignKey: 'product_id' });
    Product.hasMany(models.ProductAttributeValue, { foreignKey: 'product_id' });
  };

  return Product;
};





