export default (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
    type: {
      type: DataTypes.ENUM('fixed', 'percentage'),
      allowNull: false
    },
    discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

    target_type: {
      type: DataTypes.ENUM('cart', 'product'),
      defaultValue: 'cart'
    },
    product_id: { type: DataTypes.UUID, allowNull: true }, // if target_type is 'product'

    target_role: {
      type: DataTypes.ENUM('customer', 'retailer', 'both'),
      defaultValue: 'both'
    },

    min_cart_value: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    max_discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    usage_limit: { type: DataTypes.INTEGER, allowNull: true },
    usage_per_user: { type: DataTypes.INTEGER, allowNull: true },

    valid_from: { type: DataTypes.DATE, allowNull: false },
    valid_to: { type: DataTypes.DATE, allowNull: false },

    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },

    is_user_new: { type: DataTypes.BOOLEAN, defaultValue: false },

    created_by: { type: DataTypes.UUID, allowNull: false },
    updated_by: { type: DataTypes.UUID, allowNull: true }
  }, {
    tableName: 'Coupons',
    timestamps: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['product_id'] },
      { fields: ['target_role'] },
      { fields: ['valid_from', 'valid_to'] }
    ]
  });

  Coupon.associate = (models) => {
    // Coupon.belongsTo(models.Product, { foreignKey: 'product_id' });
    // Coupon.belongsTo(models.User, { foreignKey: 'created_by' });

    
      Coupon.belongsTo(models.Product, { foreignKey: 'product_id', constraints: false });
      Coupon.belongsTo(models.User, { foreignKey: 'created_by', constraints: true }); // creator important hai
      Coupon.belongsToMany(models.User, { through: models.CouponUser, foreignKey: 'coupon_id', constraints: false });
      Coupon.hasMany(models.Order, { foreignKey: 'coupon_id', constraints: false });
    };
    
  
    return Coupon;
  };