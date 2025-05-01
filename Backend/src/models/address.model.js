import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Address = sequelize.define('Address', {
    address_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('default', 'history'),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('home', 'work', 'other'),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nearby: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Default is true
    },
  }, {
    timestamps: true,
    tableName: 'Addresses',
    paranoid: true, // Soft delete (on delete, set is_active to false)
  });

  Address.associate = (models) => {
    // Define associations
    Address.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // Links address to a user
    Address.hasMany(models.Order, { foreignKey: 'address_id', as: 'orders' }); // Links address to orders
  };

  return Address;
};