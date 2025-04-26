export default (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      target_role: {
        type: DataTypes.ENUM('customer', 'retailer', 'both'),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'Categories'
    });
  
    Category.associate = (models) => {
      Category.belongsTo(models.User, { foreignKey: 'created_by' });
      Category.hasMany(models.Product, { foreignKey: 'category_id' });
    };
  
    return Category;
  };