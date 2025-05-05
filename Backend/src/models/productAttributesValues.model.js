import { DataTypes } from "sequelize";

export default (sequelize) => {
  const AttributeValue = sequelize.define(
    "AttributeValue",
    {
      // Define only ONE primary key
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // Make sure none of these have primaryKey: true
      attribute_id: {
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
        { fields: ["attribute_id"] },
        { fields: ["value"] },
        { fields: ["created_by"] },
        { fields: ["updated_by"] },
      ],
    }
  );

  AttributeValue.associate = (models) => {
    AttributeValue.belongsTo(models.Attribute, { foreignKey: "attribute_id" });
    AttributeValue.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });
    AttributeValue.belongsTo(models.User, {
      foreignKey: "updated_by",
      as: "updater",
    });

    // Add the many-to-many relationship with ProductVariant
    AttributeValue.belongsToMany(models.ProductVariant, {
      through: "VariantAttributeValues",
      foreignKey: "attribute_value_id",
      otherKey: "variant_id",
    });
  };

  return AttributeValue;
};
