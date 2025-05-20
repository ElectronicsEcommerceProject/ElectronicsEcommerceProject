import { DataTypes } from "sequelize";

export default (sequelize) => {
  const StockAlert = sequelize.define(
    "StockAlert",
    {
      stock_alert_id: {
        type: DataTypes.UUID, // Changed to UUID
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_variant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stock_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "sent"),
        defaultValue: "pending",
      },
      created_by: {
        type: DataTypes.UUID, // Changed to UUID
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.UUID, // Changed to UUID
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "StockAlerts",
    }
  );

  StockAlert.associate = (models) => {
    StockAlert.belongsTo(models.Product, { foreignKey: "product_id" });
    StockAlert.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
    });
    StockAlert.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    StockAlert.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });
  };

  return StockAlert;
};
