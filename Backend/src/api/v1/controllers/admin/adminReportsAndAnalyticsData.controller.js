import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import Sequelize from "sequelize";
import MESSAGE from "../../../../constants/message.js";

const { Op } = Sequelize;
const {
  User,
  Category,
  Brand,
  Product,
  ProductVariant,
  ProductMedia,
  ProductMediaUrl,
  ProductReview,
  Order,
  OrderItem,
  StockAlert,
} = db;

/**
 * Helper function to safely format date to YYYY-MM-DD format
 * @param {Date|string} dateValue - The date value to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
const formatDateToString = (dateValue) => {
  try {
    if (!dateValue) return null;
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error, "Input:", dateValue);
    return null;
  }
};

/**
 * Helper function to fetch multiple product images efficiently
 * @param {Array} productIds - Array of product IDs
 * @param {object} req - Express request object for URL construction
 * @returns {object} Map of productId to image data
 */
const getMultipleProductImages = async (productIds, req) => {
  try {
    if (!productIds || productIds.length === 0) return {};

    const productMediaList = await ProductMedia.findAll({
      where: { product_id: { [Op.in]: productIds } },
      attributes: ["product_id", "product_media_id"],
    });

    const mediaIds = productMediaList.map((media) => media.product_media_id);
    const mediaUrls = await ProductMediaUrl.findAll({
      where: { product_media_id: { [Op.in]: mediaIds } },
      attributes: ["product_media_id", "product_media_url"],
    });

    const urlMap = mediaUrls.reduce((map, url) => {
      map[url.product_media_id] = url.product_media_url;
      return map;
    }, {});

    const imageMap = {};
    productMediaList.forEach((media) => {
      let imageUrl = urlMap[media.product_media_id] || null;
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${req.protocol}://${req.get("host")}/${imageUrl.replace(
          /\\/g,
          "/"
        )}`;
      }
      imageMap[media.product_id] = {
        id: media.product_media_id,
        url: imageUrl,
      };
    });

    productIds.forEach((productId) => {
      if (!imageMap[productId]) {
        imageMap[productId] = { id: null, url: null };
      }
    });

    return imageMap;
  } catch (error) {
    console.error("Error fetching multiple product images:", error);
    return {};
  }
};

const getAnalyticsDashboardData = async (req, res) => {
  try {
    // Parse query parameters
    const { period = "month", startDate, endDate } = req.query;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let dateRange = {};
    let previousDateRange = {};

    // Determine date ranges
    if (period === "day") {
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfDay, today] };
      const startOfYesterday = new Date(today);
      startOfYesterday.setDate(today.getDate() - 1);
      startOfYesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(today);
      endOfYesterday.setDate(today.getDate() - 1);
      endOfYesterday.setHours(23, 59, 59, 999);
      previousDateRange = { [Op.between]: [startOfYesterday, endOfYesterday] };
    } else if (period === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfWeek, today] };
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - 13);
      startOfLastWeek.setHours(0, 0, 0, 0);
      const endOfLastWeek = new Date(today);
      endOfLastWeek.setDate(today.getDate() - 7);
      endOfLastWeek.setHours(23, 59, 59, 999);
      previousDateRange = { [Op.between]: [startOfLastWeek, endOfLastWeek] };
    } else if (period === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfMonth, today] };
      const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      endOfLastMonth.setHours(23, 59, 59, 999);
      previousDateRange = { [Op.between]: [startOfLastMonth, endOfLastMonth] };
    } else if (period === "custom") {
      if (!startDate || !endDate) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "startDate and endDate are required for custom period",
        });
      }
      const customStart = new Date(`${startDate}T00:00:00.000Z`);
      const customEnd = new Date(`${endDate}T23:59:59.999Z`);
      if (isNaN(customStart) || isNaN(customEnd) || customStart > customEnd) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid date range",
        });
      }
      dateRange = { [Op.between]: [customStart, customEnd] };
      const duration = customEnd - customStart;
      const previousEnd = new Date(customStart.getTime() - 1000 * 60 * 60 * 24);
      const previousStart = new Date(previousEnd.getTime() - duration);
      previousDateRange = { [Op.between]: [previousStart, previousEnd] };
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid period specified",
      });
    }

    // Sales Overview (Current Period)
    const orders = await Order.findAll({
      where: { order_date: dateRange },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "totalRevenue"],
        [Sequelize.fn("COUNT", Sequelize.col("order_id")), "totalOrders"],
      ],
      raw: true,
    });

    const totalRevenue = parseFloat(orders[0]?.totalRevenue) || 0;
    const totalOrders = parseInt(orders[0]?.totalOrders) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Previous Period Sales
    let previousOrders = await Order.findAll({
      where: { order_date: previousDateRange },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "totalRevenue"],
        [Sequelize.fn("COUNT", Sequelize.col("order_id")), "totalOrders"],
      ],
      raw: true,
    });

    const previousRevenue = parseFloat(previousOrders[0]?.totalRevenue) || 0;
    previousOrders = parseInt(previousOrders[0]?.totalOrders) || 0;

    const totalCustomers = await Order.count({
      distinct: true,
      col: "user_id",
      where: { order_date: dateRange },
    });

    const totalRetailers = await User.count({
      where: { role: "retailer", createdAt: dateRange },
    });

    const salesOverview = {
      totalRevenue,
      totalOrders,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      totalCustomers,
      totalRetailers,
      previousRevenue,
      previousOrders,
    };

    // Revenue Over Time
    const revenueData = await Order.findAll({
      where: { order_date: dateRange },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("order_date")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "revenue"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("order_date"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("order_date")), "ASC"]],
      raw: true,
    });

    const revenueOverTime = revenueData.map((entry) => ({
      date: formatDateToString(entry.date),
      revenue: parseFloat(entry.revenue) || 0,
    }));

    // Order Status Distribution
    const orderStatusData = await Order.findAll({
      where: { order_date: dateRange },
      attributes: [
        "order_status",
        [Sequelize.fn("COUNT", Sequelize.col("order_id")), "count"],
      ],
      group: ["order_status"],
      raw: true,
    });

    const orderStatusDistribution = orderStatusData.map((entry) => ({
      status: entry.order_status.toLowerCase(),
      count: parseInt(entry.count) || 0,
    }));

    // Brand Distribution (by Orders)
    const brandDistributionRaw = await OrderItem.findAll({
      where: { "$order.order_date$": dateRange },
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
        },
        {
          model: Product,
          as: "product",
          attributes: [],
          include: [
            {
              model: Brand,
              as: "brand",
              attributes: ["name"],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("product.brand.name"), "brand"],
        [Sequelize.fn("COUNT", Sequelize.col("OrderItem.order_id")), "count"],
      ],
      group: ["product.brand.brand_id", "product.brand.name"],
      raw: true,
    });

    const brandDistribution = brandDistributionRaw
      .filter((entry) => entry.brand)
      .map((entry) => ({
        brand: entry.brand,
        count: parseInt(entry.count) || 0,
      }));

    // Category Distribution (by Orders)
    const categoryDistributionRaw = await OrderItem.findAll({
      where: { "$order.order_date$": dateRange },
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
        },
        {
          model: Product,
          as: "product",
          attributes: [],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["name"],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("product.category.name"), "category"],
        [Sequelize.fn("COUNT", Sequelize.col("OrderItem.order_id")), "count"],
      ],
      group: ["product.category.category_id", "product.category.name"],
      raw: true,
    });

    const categoryDistribution = categoryDistributionRaw
      .filter((entry) => entry.category)
      .map((entry) => ({
        category: entry.category,
        count: parseInt(entry.count) || 0,
      }));

    // Customer Satisfaction
    const reviews = await ProductReview.findOne({
      where: { createdAt: dateRange },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
      ],
      raw: true,
    });

    const customerSatisfaction = parseFloat(
      reviews?.averageRating || 0
    ).toFixed(1);

    // Stock Alerts
    const stockAlertsRaw = await StockAlert.findAll({
      where: { status: "pending", createdAt: dateRange },
      include: [
        {
          model: Product,
          attributes: ["product_id", "name"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "stock_quantity"],
        },
      ],
      attributes: ["stock_alert_id", "status", "stock_level"],
      raw: true,
    });

    const stockAlerts = stockAlertsRaw.map((alert) => ({
      stockAlertId: alert.stock_alert_id,
      productId: alert["Product.product_id"],
      productName: alert["Product.name"],
      variantId: alert["ProductVariant.product_variant_id"],
      sku: alert["ProductVariant.sku"] || "N/A",
      stockLevel: parseInt(alert.stock_level) || 0,
      alertStatus: alert.status,
    }));

    // Response
    const responseData = {
      salesOverview,
      revenueOverTime,
      orderStatusDistribution,
      brandDistribution,
      categoryDistribution,
      customerSatisfaction: parseFloat(customerSatisfaction),
      stockAlerts,
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default { getAnalyticsDashboardData };
