import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Attribute = sequelize.define(
    "Attribute",
    {
      product_attribute_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      is_variant_level: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // other fields...
    },
    {
      tableName: "Attributes",
      timestamps: true,
    }
  );

  return Attribute;
};
