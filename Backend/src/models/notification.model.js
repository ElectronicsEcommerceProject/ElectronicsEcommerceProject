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
        allowNull: true, 
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("info", "warning", "error", "success"),
        defaultValue: "info",
      },
      channel: {
        type: DataTypes.ENUM("email", "sms", "in_app", "push"),
        defaultValue: "in_app",
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true, 
      },
    },
    {
      timestamps: true,
      paranoid: true, 
      tableName: "Notifications",
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "user_id", as: "recipient" });
    Notification.belongsTo(models.User, { foreignKey: "created_by", as: "creator" });
  };

  return Notification;
};



