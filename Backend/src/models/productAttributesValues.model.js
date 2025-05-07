import { DataTypes } from "sequelize";

export default (sequelize) => {
  const AttributeValue = sequelize.define(
    "AttributeValue",
    {
      // Define only ONE primary key
      product_attribute_value_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Make sure none of these have primaryKey: true
      product_attribute_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "AttributeValues",
      timestamps: true,
      indexes: [
        { fields: ["product_attribute_id"] },
        { fields: ["value"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  AttributeValue.associate = (models) => {
    AttributeValue.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });

    // Add the many-to-many relationship with ProductVariant
    AttributeValue.belongsToMany(models.ProductVariant, {
      through: "VariantAttributeValues",
      foreignKey: "product_attribute_value_id",
      otherKey: "product_variant_id",
    });
  };

  return AttributeValue;
};
