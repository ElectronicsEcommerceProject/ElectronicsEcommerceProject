export default (sequelize, DataTypes) => {
    const CouponUser = sequelize.define('CouponUser', {
      coupon_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      timestamps: false,
      tableName: 'Coupon_Users'
    });
  
    CouponUser.associate = (models) => {
      CouponUser.belongsTo(models.Coupon, { foreignKey: 'coupon_id' });
      CouponUser.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return CouponUser;
  };