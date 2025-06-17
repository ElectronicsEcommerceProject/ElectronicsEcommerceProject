import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      coupon_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.STRING },
      type: {
        type: DataTypes.ENUM("fixed", "percentage"),
        allowNull: false,
      },
      discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      target_type: {
        type: DataTypes.ENUM(
          "cart",
          "product",
          "product_variant",
          "category",
          "brand"
        ),
        defaultValue: "cart",
      },
      category_id: { type: DataTypes.UUID, allowNull: true },
      brand_id: { type: DataTypes.UUID, allowNull: true },
      product_id: { type: DataTypes.UUID, allowNull: true },
      product_variant_id: { type: DataTypes.UUID, allowNull: true },
      target_role: {
        type: DataTypes.ENUM("customer", "retailer", "both"),
        defaultValue: "both",
      },
      min_cart_value: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      max_discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      usage_limit: { type: DataTypes.INTEGER, allowNull: true },
      usage_per_user: { type: DataTypes.INTEGER, allowNull: true },
      valid_from: { type: DataTypes.DATE, allowNull: false },
      valid_to: { type: DataTypes.DATE, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      is_user_new: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
      updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
    },
    {
      tableName: "Coupons",
      timestamps: true,
      paranoid: true, // preserve redemption history

      indexes: [
        { fields: ["code"], unique: true },
        { fields: ["product_id"] },
        { fields: ["target_role"] },
        { fields: ["valid_from", "valid_to"] },
        { fields: ["is_active"] },
      ],
    }
  );

  Coupon.associate = (models) => {
    Coupon.belongsTo(models.Category, { foreignKey: "category_id" });
    Coupon.belongsTo(models.Brand, { foreignKey: "brand_id" });
    Coupon.belongsTo(models.Product, { foreignKey: "product_id" });
    Coupon.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
    });
    Coupon.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
    Coupon.belongsTo(models.User, { foreignKey: "updated_by", as: "updater" });
    Coupon.belongsToMany(models.User, {
      through: models.CouponUser,
      foreignKey: "coupon_id",
    });
    Coupon.hasMany(models.Order, { foreignKey: "coupon_id" });
    Coupon.hasMany(models.CouponRedemption, { foreignKey: "coupon_id" });
    Coupon.hasMany(models.CartItem, {
      foreignKey: "coupon_id",
    }); // Links coupon to cart items where it's applied
  };

  return Coupon;
};
