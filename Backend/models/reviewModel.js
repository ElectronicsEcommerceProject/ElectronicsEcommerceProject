export default (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'Reviews'
    });
  
    Review.associate = (models) => {
      Review.belongsTo(models.Product, { foreignKey: 'product_id' });
      Review.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Review;
  };