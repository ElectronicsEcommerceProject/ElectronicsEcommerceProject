import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Review = sequelize.define('Review', {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.UUID, // Explicitly defined
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER, // Explicitly defined
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true, // Changed to true
    tableName: 'Reviews',
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Product, { foreignKey: 'product_id' });
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Review;
};