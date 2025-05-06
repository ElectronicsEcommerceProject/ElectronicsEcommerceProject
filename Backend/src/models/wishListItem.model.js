import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const WishListItem = sequelize.define('WishListItem', {
    wish_list_item_id: {
      type: DataTypes.UUID, // UUID for primary key
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
      primaryKey: true,
    },
    wishlist_id: {
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
    // product_attribute_id: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    // },
  }, {
    timestamps: true,
    tableName: 'WishListItems',
  });

  WishListItem.associate = (models) => {
    WishListItem.belongsTo(models.Wishlist, { foreignKey: 'wishlist_id', as: 'wishlist' });
    WishListItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    WishListItem.belongsTo(models.ProductVariant, { foreignKey: 'product_variant_id', as: 'variant' });
    // WishListItem.belongsTo(models.Attribute, { foreignKey: 'product_attribute_id', as: 'attribute' });
  };

  return WishListItem;
};