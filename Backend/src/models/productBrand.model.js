import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Brand = sequelize.define(
    "Brand",
    {
      brand_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      slug: { type: DataTypes.STRING, unique: true },
      created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
      updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
    },
    {
      tableName: "Brands",
      timestamps: true,
      // paranoid: true, // preserve brand history

      indexes: [
        { fields: ["name"] },
        { fields: ["slug"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  Brand.associate = (models) => {
    Brand.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
    Brand.belongsTo(models.User, { foreignKey: "updated_by", as: "updater" });
    Brand.hasMany(models.Product, { foreignKey: "brand_id" });
    Brand.hasMany(models.Coupon, { foreignKey: "brand_id" });
    Brand.hasMany(models.DiscountRule, {
      foreignKey: "brand_id",
      as: "discountRules",
    });
  };

  return Brand;
};
