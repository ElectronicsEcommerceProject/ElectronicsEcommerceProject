export default (sequelize, DataTypes) => {
    const Coupon = sequelize.define('Coupon', {
      coupon_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
      },
      valid_from: {
        type: DataTypes.DATE,
        allowNull: false
      },
      valid_until: {
        type: DataTypes.DATE,
        allowNull: false
      },
      target_role: {
        type: DataTypes.ENUM('customer', 'retailer', 'both'),
        allowNull: false
      },
      is_user_specific: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      timestamps: false,
      tableName: 'Coupons'
    });
  
    Coupon.associate = (models) => {
      Coupon.belongsTo(models.Product, { foreignKey: 'product_id', constraints: false });
      Coupon.belongsTo(models.User, { foreignKey: 'created_by', constraints: true }); // creator important hai
      Coupon.belongsToMany(models.User, { through: models.CouponUser, foreignKey: 'coupon_id', constraints: false });
      Coupon.hasMany(models.Order, { foreignKey: 'coupon_id', constraints: false });
    };
    
  
    return Coupon;
  };