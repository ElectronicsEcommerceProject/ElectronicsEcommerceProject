import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled', 'cancel_requested'),
      defaultValue: 'pending',
    },
    address_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'Orders',
  });

  Order.associate = (models) => {
    // Define associations
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // Links order to a user
    Order.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' }); // Links order to an address
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'orderItems' }); // Links order to its items
    Order.hasMany(models.CouponRedemption, { foreignKey: 'order_id', as: 'couponRedemptions' }); // Links order to coupon redemptions
  };

  return Order;
};