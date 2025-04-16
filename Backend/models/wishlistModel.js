export default (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
      wishlist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'Wishlist'
    });
  
    Wishlist.associate = (models) => {
      Wishlist.belongsTo(models.User, { foreignKey: 'user_id' });
      Wishlist.belongsTo(models.Product, { foreignKey: 'product_id' });
    };
  
    return Wishlist;
  };