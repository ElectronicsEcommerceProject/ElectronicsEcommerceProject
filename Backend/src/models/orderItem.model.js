import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_at_time: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_applied: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  }, {
    timestamps: true, // Changed to true for consistency
    tableName: 'OrderItems', // Changed to camelCase for consistency
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return OrderItem;
};