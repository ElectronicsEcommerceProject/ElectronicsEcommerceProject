export default (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price_at_time: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      discount_applied: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      }
    }, {
      timestamps: false,
      tableName: 'Order_Items'
    });
  
    OrderItem.associate = (models) => {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
      OrderItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    };
  
    return OrderItem;
  };