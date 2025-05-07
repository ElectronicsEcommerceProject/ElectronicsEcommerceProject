import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      payment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "INR",
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
      payment_status: {
        type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
        defaultValue: "pending",
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      payment_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "Payments",
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Payment.hasMany(models.Order, { foreignKey: "payment_id", as: "orders" });
  };

  return Payment;
};
