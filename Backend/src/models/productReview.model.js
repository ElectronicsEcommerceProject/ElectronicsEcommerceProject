import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ProductReview = sequelize.define('ProductReview', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: { type: DataTypes.UUID, allowNull: false },
    variant_id: { type: DataTypes.UUID, allowNull: true },
    user_id: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
    rating: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: true },
    review: { type: DataTypes.TEXT, allowNull: true },
    is_verified_purchase: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
    updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
  }, {
    tableName: 'ProductReviews',
    timestamps: true,
    indexes: [
      { fields: ['product_id'] },
      { fields: ['variant_id'] },
      { fields: ['user_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  ProductReview.associate = (models) => {
    ProductReview.belongsTo(models.Product, { foreignKey: 'product_id' });
    ProductReview.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
    ProductReview.belongsTo(models.User, { foreignKey: 'user_id', as: 'reviewer' });
    ProductReview.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    ProductReview.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return ProductReview;
};