import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Owner = sequelize.define('Owner', {
    owner_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    profileImage_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    default_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active',
    },
    role: {
      type: DataTypes.ENUM('admin'),
      allowNull: false,
      defaultValue: 'admin',
    },
  }, {
    timestamps: true,
    tableName: 'Owners',
  });

  Owner.associate = (models) => {
    // Define associations
    Owner.hasMany(models.Store, { foreignKey: 'owner_id', as: 'stores' }); // Example: Owner can have multiple stores
    Owner.hasMany(models.Product, { foreignKey: 'created_by', as: 'products' }); // Example: Owner can create products
  };

  return Owner;
};