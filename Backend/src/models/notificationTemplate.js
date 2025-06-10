import { DataTypes } from "sequelize";

export default (sequelize) => {
  const NotificationTemplate = sequelize.define(
    "NotificationTemplate",
    {
      template_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("email", "sms", "in_app"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true, // Soft delete
      tableName: "NotificationTemplates",
      indexes: [
        { fields: ["name"] },
        { fields: ["type"] },
        { fields: ["created_by"] },
      ],
    }
  );

  NotificationTemplate.associate = (models) => {
    NotificationTemplate.belongsTo(models.User, { foreignKey: "created_by" });
    NotificationTemplate.belongsTo(models.User, { foreignKey: "updated_by" });
    NotificationTemplate.hasMany(models.Notification, {
      foreignKey: "template_id",
    });
  };

  return NotificationTemplate;
};
