import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled', 'cancel_requested'),
      defaultValue: 'pending',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true, // Changed to true for consistency
    tableName: 'Orders',
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.belongsTo(models.Coupon, { foreignKey: 'coupon_id' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
  };

  return Order;
};