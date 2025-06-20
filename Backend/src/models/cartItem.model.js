import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
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
      product_variant_id: {
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
      discount_type: {
        type: DataTypes.ENUM("fixed", "percentage"),
        allowNull: true,
        comment:
          "Specifies whether discount_applied is a fixed amount or percentage",
      },
      coupon_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: "References the coupon applied to this specific cart item",
      },
      final_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "CartItems",
    }
  );

  CartItem.associate = (models) => {
    // Define associations
    CartItem.belongsTo(models.Cart, {
      foreignKey: "cart_id",
      onDelete: "CASCADE",
      as: "cart",
    }); // Links cart item to a cart
    CartItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    }); // Links cart item to a product
    CartItem.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
      as: "variant",
    }); // Links cart item to a product variant
    CartItem.belongsTo(models.Coupon, {
      foreignKey: "coupon_id",
    }); // Links cart item to the applied coupon
  };

  return CartItem;
};
