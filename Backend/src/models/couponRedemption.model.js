export default (sequelize, DataTypes) => {
  const CouponRedemption = sequelize.define('CouponRedemption', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    coupon_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    order_id: { type: DataTypes.UUID, allowNull: true },
    redeemed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'CouponRedemptions',
    indexes: [
      { fields: ['coupon_id'] },
      { fields: ['user_id'] }
    ]
  });

  CouponRedemption.associate = (models) => {
    CouponRedemption.belongsTo(models.Coupon, { foreignKey: 'coupon_id' });
    CouponRedemption.belongsTo(models.User, { foreignKey: 'user_id' });
    CouponRedemption.belongsTo(models.Order, { foreignKey: 'order_id' });
  };

  return CouponRedemption;
};
