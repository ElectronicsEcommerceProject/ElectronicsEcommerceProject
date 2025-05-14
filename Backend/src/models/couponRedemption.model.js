import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CouponRedemption = sequelize.define(
    "CouponRedemption",
    {
      coupon_redemption_id: {
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
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "CouponRedemptions",
      timestamps: true,
    }
  );

  CouponRedemption.associate = (models) => {
    CouponRedemption.belongsTo(models.Coupon, {
      foreignKey: "coupon_id",
      as: "coupon",
    });
    CouponRedemption.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    CouponRedemption.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };

  return CouponRedemption;
};
