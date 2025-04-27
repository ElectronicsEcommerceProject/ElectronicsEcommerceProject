import db from '../models/index.js';
const { StockAlert, Product } = db;

// 📦 Get All Stock Alerts (for admin dashboard)
const getAllStockAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.findAll({
      where: { status: 'pending' },
      include: [{ model: Product, attributes: ['name', 'stock', 'stock_alert_threshold'] }]
    });

    res.status(200).json(alerts);
  } catch (error) {
    console.error("❌ Error fetching stock alerts:", error);
    res.status(500).json({ message: 'Failed to retrieve stock alerts' });
  }
};


export default getAllStockAlerts;