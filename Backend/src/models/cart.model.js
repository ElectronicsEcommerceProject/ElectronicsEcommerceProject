import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    timestamps: true, // Changed to true for consistency
    tableName: 'Carts',
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Cart;
};