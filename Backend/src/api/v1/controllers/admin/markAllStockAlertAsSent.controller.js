import db from '../models/index.js';
const { StockAlert, Product } = db;


// ✅ Admin marks this stock alert as handled so it doesn't show up in "pending" alerts anymore

export const markAlertAsSent = async (req, res) => {
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
