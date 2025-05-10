import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Wishlist = sequelize.define(
    "Wishlist",
    {
      wishlist_id: {
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
      tableName: "Wishlists",
    }
  );

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Wishlist;
};
