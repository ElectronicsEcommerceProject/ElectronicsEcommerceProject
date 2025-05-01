import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const StockAlert = sequelize.define('StockAlert', {
    alert_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.UUID, // Explicitly defined
      allowNull: false,
    },
    stock_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent'),
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true, // Changed to true
    tableName: 'StockAlerts', // Changed to camelCase
  });

  StockAlert.associate = (models) => {
    StockAlert.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return StockAlert;
};