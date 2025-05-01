import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    parent_id: { type: DataTypes.UUID, allowNull: true },
    created_by: { type: DataTypes.UUID, allowNull: false }, // Changed to UUID
    updated_by: { type: DataTypes.UUID, allowNull: true }, // Changed to UUID
    target_role: {
      type: DataTypes.ENUM('customer', 'retailer', 'both'),
      allowNull: false,
    },
  }, {
    tableName: 'Categories',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['slug'] },
      { fields: ['parent_id'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  Category.associate = (models) => {
    Category.belongsTo(models.Category, { foreignKey: 'parent_id', as: 'parentCategory' });
    Category.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    Category.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
    Category.hasMany(models.Product, { foreignKey: 'category_id' });
  };

  return Category;
};