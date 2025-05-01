const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const ProductReview = sequelize.define('ProductReview', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  product_id: { type: DataTypes.UUID, allowNull: false },
  variant_id: { type: DataTypes.UUID, allowNull: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: true },
  review: { type: DataTypes.TEXT, allowNull: true },
  is_verified_purchase: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_by: { type: DataTypes.UUID, allowNull: false },
  updated_by: { type: DataTypes.UUID, allowNull: true },
}, {
  indexes: [
    { fields: ['product_id'] },
    { fields: ['variant_id'] },
    { fields: ['user_id'] },
    { fields: ['created_by'] },
    { fields: ['updated_by'] }
  ]
});

ProductReview.associate = (models) => {
  ProductReview.belongsTo(models.Product, { foreignKey: 'product_id' });
  ProductReview.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
};

module.exports = ProductReview;
