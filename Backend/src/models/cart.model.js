import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Cart = sequelize.define(
    "Cart",
    {
      cart_id: {
        type: DataTypes.UUID, // UUID for primary key
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true, // Enable timestamps for createdAt and updatedAt
      tableName: "Carts",
    }
  );

  Cart.associate = (models) => {
    // Define associations
    Cart.belongsTo(models.User, { foreignKey: "user_id", as: "user" }); // Links cart to a user
    Cart.hasMany(models.CartItem, {
      foreignKey: "cart_id",
      onDelete: "CASCADE",
      as: "cartItem",
    }); // Cart has many items
  };

  return Cart;
};
