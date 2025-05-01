export default (sequelize, DataTypes) => {
  
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT },
    short_description: { type: DataTypes.TEXT },
    base_price: { type: DataTypes.DECIMAL(10, 2) },
    rating_average: { type: DataTypes.DECIMAL(2, 1) },
    rating_count: { type: DataTypes.INTEGER },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    category_id: { type: DataTypes.UUID, allowNull: false },
    brand_id: { type: DataTypes.UUID, allowNull: false },
    created_by: { type: DataTypes.UUID, allowNull: false },
    updated_by: { type: DataTypes.UUID, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    target_role: {
      type: DataTypes.ENUM('customer', 'retailer', 'both'),
      allowNull: false
    }
  }, {
    indexes: [
      { fields: ['category_id'] },
      { fields: ['brand_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
      { fields: ['slug'] },
      { fields: ['title', 'description', 'short_description'], type: 'FULLTEXT' } // Full-text index on these fields

    ]
  });
  
  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.Brand, { foreignKey: 'brand_id' });
    Product.hasMany(models.ProductVariant, { foreignKey: 'product_id' });
    Product.hasMany(models.ProductMedia, { foreignKey: 'product_id' });
    Product.hasMany(models.ProductReview, { foreignKey: 'product_id' });
    Product.hasMany(models.DiscountRule, { foreignKey: 'product_id' });
    Product.hasMany(models.ProductAttribute, { foreignKey: 'product_id' });
       
        Product.belongsTo(models.User, { foreignKey: 'created_by' });
        Product.hasMany(models.Coupon, { foreignKey: 'product_id' });
        Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
      Product.hasMany(models.Cart, { foreignKey: 'product_id' });
      Product.hasMany(models.Wishlist, { foreignKey: 'product_id' });
      Product.hasMany(models.Review, { foreignKey: 'product_id' });
      Product.hasMany(models.StockAlert, { foreignKey: 'product_id' });
    };
  
    return Product;
  };