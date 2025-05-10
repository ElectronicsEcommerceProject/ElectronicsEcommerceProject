import { DataTypes } from "sequelize";

export default (sequelize) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      order_item_id: {
        type: DataTypes.UUID, // UUID for primary key
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_variant_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      price_at_time: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_applied: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      final_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "OrderItems",
    }
  );

  OrderItem.associate = (models) => {
    // Define associations
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id", as: "order" }); // Links order item to an order
    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    }); // Links order item to a product
    OrderItem.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
      as: "productVariant",
    }); // Links order item to a product variant
  };

  return OrderItem;
};
