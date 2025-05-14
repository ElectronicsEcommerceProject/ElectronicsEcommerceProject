import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { StockAlert, Product, ProductVariant, User } = db;

// Get All Stock Alerts (for admin dashboard)
const getAllStockAlerts = async (req, res) => {
  try {
    const { status } = req.query;

    // Filter by status if provided
    const whereClause = status ? { status } : {};

    const alerts = await StockAlert.findAll({
      where: whereClause,
      include: [
        {
          model: Product,
          attributes: ["name", "stock_alert_threshold"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "stock_quantity"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: alerts,
    });
  } catch (error) {
    console.error("❌ Error fetching stock alerts:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get Stock Alert by ID
const getStockAlertById = async (req, res) => {
  try {
    const { alert_id } = req.params;

    const alert = await StockAlert.findByPk(alert_id, {
      include: [
        {
          model: Product,
          attributes: ["name", "stock_alert_threshold"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "stock_quantity"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    if (!alert) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: alert,
    });
  } catch (error) {
    console.error("❌ Error fetching stock alert:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Create a new stock alert
const createStockAlert = async (req, res) => {
  try {
    const { product_id, product_variant_id, stock_level, status } = req.body;

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    // Verify product variant exists
    const variant = await ProductVariant.findByPk(product_variant_id);
    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product variant not found",
      });
    }

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Create the alert
    const newAlert = await StockAlert.create({
      product_id,
      product_variant_id,
      stock_level,
      status: status || "pending",
      created_by: user.user_id,
    });

    // Fetch the created alert with associations
    const createdAlert = await StockAlert.findByPk(newAlert.alert_id, {
      include: [{ model: Product }, { model: User, as: "creator" }],
    });

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newAlert,
    });
  } catch (error) {
    console.error("❌ Error creating stock alert:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// Update a stock alert
const updateStockAlert = async (req, res) => {
  try {
    const { alert_id } = req.params;
    const { product_id, product_variant_id, stock_level, status } = req.body;

    // Find the alert
    const alert = await StockAlert.findByPk(alert_id);
    if (!alert) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Verify product exists if provided
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }
    }

    // Verify product variant exists if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findByPk(product_variant_id);
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found",
        });
      }
    }

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Update the alert
    await alert.update({
      product_id: product_id || alert.product_id,
      product_variant_id: product_variant_id || alert.product_variant_id,
      stock_level: stock_level || alert.stock_level,
      status: status || alert.status,
      updated_by: user.user_id,
    });

    // Fetch the updated alert with associations
    const updatedAlert = await StockAlert.findByPk(alert_id, {
      include: [
        { model: Product },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: updatedAlert,
    });
  } catch (error) {
    console.error("❌ Error updating stock alert:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// Admin marks this stock alert as handled
const markAlertAsSent = async (req, res) => {
  try {
    const { alert_id } = req.params;

    // Find the alert
    const alert = await StockAlert.findByPk(alert_id);
    if (!alert) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Update the alert
    alert.status = "sent";
    alert.updated_by = user.user_id;
    await alert.save();

    // Fetch the updated alert with associations
    const updatedAlert = await StockAlert.findByPk(alert_id, {
      include: [
        { model: Product },
        { model: ProductVariant },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: updatedAlert,
    });
  } catch (error) {
    console.error("❌ Error updating stock alert:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// Delete a stock alert
const deleteStockAlert = async (req, res) => {
  try {
    const { alert_id } = req.params;

    // Find the alert
    const alert = await StockAlert.findByPk(alert_id);
    if (!alert) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Delete the alert
    await alert.destroy();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("❌ Error deleting stock alert:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

export default {
  getAllStockAlerts,
  getStockAlertById,
  createStockAlert,
  updateStockAlert,
  markAlertAsSent,
  deleteStockAlert,
};
