import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.UUID, // UUID for primary key
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    timestamps: true, // Enable timestamps for createdAt and updatedAt
    tableName: 'Carts',
  });

  Cart.associate = (models) => {
    // Define associations
    Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // Links cart to a user
    Cart.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' }); // Links cart to a product
  };

  return Cart;
};