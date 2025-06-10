import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      notification_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true, // Null for group notifications
      },
      template_id: {
        type: DataTypes.UUID,
        allowNull: true, // Optional template
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      channel: {
        type: DataTypes.ENUM("email", "sms", "in_app"),
        defaultValue: "in_app",
      },
      status: {
        type: DataTypes.ENUM("pending", "sent", "failed"),
        defaultValue: "pending",
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true, // Admin who sent the notification
      },
      audience_type: {
        type: DataTypes.ENUM(
          "all_users",
          "all_customers",
          "all_retailers",
          "specific_users"
        ),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true, // Soft delete
      tableName: "Notifications",
      indexes: [
        { fields: ["user_id"] },
        { fields: ["created_by"] },
        { fields: ["channel"] },
        { fields: ["status"] },
      ],
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "user_id" }); // Recipient
    Notification.belongsTo(models.User, { foreignKey: "created_by" }); // Creator
    Notification.belongsTo(models.NotificationTemplate, {
      foreignKey: "template_id",
    });
    // Optional: Uncomment if notifications are tied to orders or products
    // Notification.belongsTo(models.Order, { foreignKey: "order_id" });
    // Notification.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return Notification;
};
