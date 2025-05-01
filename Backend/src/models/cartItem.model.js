import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    cart_item_id: {
      type: DataTypes.UUID, // UUID for primary key
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
      primaryKey: true,
    },
    cart_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    attribute_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_at_time: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_applied: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'CartItems',
  });

  CartItem.associate = (models) => {
    // Define associations
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' }); // Links cart item to a cart
    CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' }); // Links cart item to a product
    CartItem.belongsTo(models.ProductVariant, { foreignKey: 'variant_id', as: 'variant' }); // Links cart item to a product variant
    CartItem.belongsTo(models.Attribute, { foreignKey: 'attribute_id', as: 'attribute' }); // Links cart item to an attribute
  };

  return CartItem;
};