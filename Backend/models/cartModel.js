export default (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    }, {
      timestamps: false,
      tableName: 'Cart'
    });
  
    Cart.associate = (models) => {
      Cart.belongsTo(models.User, { foreignKey: 'user_id' });
      Cart.belongsTo(models.Product, { foreignKey: 'product_id' });
    };
  
    return Cart;
  };