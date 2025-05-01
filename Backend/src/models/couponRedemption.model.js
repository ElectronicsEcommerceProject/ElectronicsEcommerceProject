import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CouponRedemption = sequelize.define('CouponRedemption', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    coupon_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false }, // Changed to INTEGER
    order_id: { type: DataTypes.INTEGER, allowNull: true }, // Changed to INTEGER
    redeemed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'CouponRedemptions',
    timestamps: true, // Explicitly set to true
    indexes: [
      { fields: ['coupon_id'] },
      { fields: ['user_id'] },
    ],
  });

  CouponRedemption.associate = (models) => {
    CouponRedemption.belongsTo(models.Coupon, { foreignKey: 'coupon_id' });
    CouponRedemption.belongsTo(models.User, { foreignKey: 'user_id' });
    CouponRedemption.belongsTo(models.Order, { foreignKey: 'order_id' });
  };

  return CouponRedemption;
};