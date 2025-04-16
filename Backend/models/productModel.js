export default (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      discount_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      min_retailer_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      bulk_discount_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      bulk_discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      stock_alert_threshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      target_role: {
        type: DataTypes.ENUM('customer', 'retailer'),
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName: 'Products'
    });
  
    Product.associate = (models) => {
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
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