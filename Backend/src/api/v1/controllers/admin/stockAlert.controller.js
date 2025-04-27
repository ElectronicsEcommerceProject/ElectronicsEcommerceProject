import db from '../../../../models/index.js'; // Import the database models
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


// ✅ Admin marks this stock alert as handled so it doesn't show up in "pending" alerts anymore

const markAlertAsSent = async (req, res) => {
  try {
    const { alert_id } = req.params;
    const alert = await StockAlert.findByPk(alert_id);

    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.status = 'sent';
    await alert.save();

    res.status(200).json({ message: 'Alert marked as sent' });
  } catch (error) {
    console.error("❌ Error updating stock alert:", error);
    res.status(500).json({ message: 'Failed to update alert status' });
  }
};


export default { getAllStockAlerts, markAlertAsSent };