import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Wishlist = sequelize.define('Wishlist', {
    wishlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER, // Explicitly defined
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID, // Explicitly defined
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true, // Changed to true
    tableName: 'Wishlists', // Changed to camelCase
  });

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: 'user_id' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Wishlist;
};