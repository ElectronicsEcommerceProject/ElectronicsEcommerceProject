import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CouponUser = sequelize.define(
    "CouponUser",
    {
      coupon_user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      coupon_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID, // Changed to UUID
        allowNull: false,
      },
    },
    {
      tableName: "CouponUsers",
      timestamps: true,
      indexes: [
        { fields: ["coupon_id"] },
        { fields: ["user_id"] },
        { unique: true, fields: ["coupon_id", "user_id"] }, // Prevent duplicate entries
      ],
    }
  );

  CouponUser.associate = (models) => {
    CouponUser.belongsTo(models.Coupon, { foreignKey: "coupon_id" });
    CouponUser.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return CouponUser;
};
