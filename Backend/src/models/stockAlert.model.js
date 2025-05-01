export default (sequelize, DataTypes) => {
    const StockAlert = sequelize.define('StockAlert', {
      alert_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      stock_level: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'sent'),
        defaultValue: 'pending'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'Stock_Alerts'
    });
  
    StockAlert.associate = (models) => {
      StockAlert.belongsTo(models.Product, { foreignKey: 'product_id', constraints: false });
    };
    
  
    return StockAlert;
  };