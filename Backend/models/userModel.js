export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      phone_number: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM('customer', 'retailer', 'admin'),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'Users'
    });
  
    User.associate = (models) => {
      User.hasMany(models.Product, { foreignKey: 'created_by' });
      User.hasMany(models.Category, { foreignKey: 'created_by' });
      User.hasMany(models.Coupon, { foreignKey: 'created_by' });
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasMany(models.Cart, { foreignKey: 'user_id' });
      User.hasMany(models.Wishlist, { foreignKey: 'user_id' });
      User.hasMany(models.Review, { foreignKey: 'user_id' });
      User.belongsToMany(models.Coupon, { through: models.CouponUser, foreignKey: 'user_id' });
    };
  
    return User;
  };