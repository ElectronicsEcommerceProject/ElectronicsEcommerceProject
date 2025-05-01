import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Store = sequelize.define('Store', {
    store_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'Stores',
  });

  Store.associate = (models) => {
    Store.belongsTo(models.Owner, { foreignKey: 'owner_id', as: 'owner' });
  };

  return Store;
};