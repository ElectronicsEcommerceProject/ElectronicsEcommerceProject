import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CouponRedemption = sequelize.define('CouponRedemption', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    coupon_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    redeemed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'CouponRedemptions',
    timestamps: true,
  });

  CouponRedemption.associate = (models) => {
    CouponRedemption.belongsTo(models.Coupon, { foreignKey: 'coupon_id' });
    CouponRedemption.belongsTo(models.User, { foreignKey: 'user_id' });
    CouponRedemption.belongsTo(models.Order, { foreignKey: 'order_id' });
  };

  return CouponRedemption;
};