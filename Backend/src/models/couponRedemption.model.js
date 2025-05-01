// filepath: /home/satyam/Desktop/ElectronicsEcommerceProject/Backend/src/models/couponRedemption.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CouponRedemption = sequelize.define('CouponRedemption', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    coupon_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
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
  };

  return CouponRedemption;
};