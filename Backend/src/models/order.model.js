import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      order_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      address_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      order_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      order_status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled"
        ),
        defaultValue: "pending",
      },
      payment_status: {
        type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
        defaultValue: "pending",
      },
      payment_method: {
        type: DataTypes.ENUM(
          "credit_card",
          "debit_card",
          "upi",
          "cod",
          "net_banking"
        ),
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tracking_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "Orders",
      indexes: [
        { fields: ["user_id"] }, // User order history
        { fields: ["order_status"] }, // Filtering by status (e.g., "pending")
        { fields: ["order_date"] }, // Sorting by date
      ],
    }
  );

  indexes: [
    { fields: ["user_id"] }, // User order history
    { fields: ["order_status"] }, // Filtering by status (e.g., "pending")
    { fields: ["order_date"] }, // Sorting by date
  ];

  Order.associate = (models) => {
    // Define associations
    Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Order.belongsTo(models.Address, {
      foreignKey: "address_id",
      as: "address",
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "orderItems",
    });
    Order.hasMany(models.CouponRedemption, {
      foreignKey: "order_id",
      as: "couponRedemptions",
    });
    Order.belongsTo(models.Payment, {
      foreignKey: "payment_id",
      as: "payment",
    });
  };

  return Order;
};
