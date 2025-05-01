import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DiscountRule = sequelize.define('DiscountRule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rule_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    attribute_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    min_retailer_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bulk_discount_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bulk_discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    discount_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true, // Changed to true for consistency
    tableName: 'DiscountRules',
    indexes: [
      { fields: ['product_id'] },
      { fields: ['category_id'] },
      { fields: ['brand_id'] },
      { fields: ['attribute_id'] },
      { fields: ['variant_id'] },
      { fields: ['rule_type'] },
      { fields: ['created_by'] },
      { fields: ['updated_by'] },
    ],
  });

  DiscountRule.associate = (models) => {
    DiscountRule.belongsTo(models.Product, { foreignKey: 'product_id' });
    DiscountRule.belongsTo(models.Category, { foreignKey: 'category_id' });
    DiscountRule.belongsTo(models.Brand, { foreignKey: 'brand_id' });
    DiscountRule.belongsTo(models.Attribute, { foreignKey: 'attribute_id' });
    DiscountRule.belongsTo(models.ProductVariant, { foreignKey: 'variant_id' });
    DiscountRule.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    DiscountRule.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return DiscountRule;
};