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
  productMediaUrl,
  ProductReview,
  Order,
  OrderItem,
  Cart,
  CartItem,
  StockAlert,
  WishListItem,
  Coupon,
  CouponRedemption,
} = db;

/**
 * Helper function to safely format date to YYYY-MM-DD format
 * Handles both Date objects and date strings
 * @param {Date|string} dateValue - The date value to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
const formatDateToString = (dateValue) => {
  try {
    if (!dateValue) {
      return null;
    }

    // If it's already a string in YYYY-MM-DD format, return as is
    if (typeof dateValue === "string") {
      // Check if it's already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }
      // Try to parse the string as a date
      const parsedDate = new Date(dateValue);
      if (isNaN(parsedDate.getTime())) {
        console.warn("Invalid date string:", dateValue);
        return null;
      }
      return parsedDate.toISOString().split("T")[0];
    }

    // If it's a Date object
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) {
        console.warn("Invalid Date object:", dateValue);
        return null;
      }
      return dateValue.toISOString().split("T")[0];
    }

    // If it's neither string nor Date, try to convert
    const convertedDate = new Date(dateValue);
    if (isNaN(convertedDate.getTime())) {
      console.warn("Unable to convert to date:", dateValue);
      return null;
    }
    return convertedDate.toISOString().split("T")[0];
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
    const mediaUrls = await productMediaUrl.findAll({
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

/**
 * Helper function to safely format date to YYYY-MM-DD format
 * @param {Date|string} dateValue - The date value to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */

const getProductsAnalyticsData = async (req, res) => {
  try {
    // Parse query parameters
    const { period = "month", startDate, endDate } = req.query;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let dateRange = {};

    // Determine date range
    if (period === "day") {
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfDay, today] };
    } else if (period === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfWeek, today] };
    } else if (period === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfMonth, today] };
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
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid period specified",
      });
    }

    // Revenue Over Time
    const revenueData = await Order.findAll({
      where: { order_date: dateRange },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("order_date")), "period"],
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "revenue"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("order_date"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("order_date")), "ASC"]],
      raw: true,
    });

    const revenueOverTime = revenueData.map((entry) => ({
      period: formatDateToString(entry.period),
      revenue: parseFloat(entry.revenue) || 0,
    }));

    // Top Selling Products (Top 5 by quantity sold)
    const topSellingProductsRaw = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: { order_date: dateRange },
          attributes: [],
        },
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("product.product_id"), "productId"],
        [Sequelize.col("product.name"), "name"],
        [Sequelize.col("product.category.name"), "category"],
        [Sequelize.fn("SUM", Sequelize.col("total_quantity")), "sales"],
      ],
      group: [
        "OrderItem.product_id",
        "product.product_id",
        "product.name",
        "product.category.category_id",
        "product.category.name",
      ],
      order: [[Sequelize.fn("SUM", Sequelize.col("total_quantity")), "DESC"]],
      limit: 5,
      raw: true,
    });

    const topSellingProducts = topSellingProductsRaw.map((entry) => ({
      productId: entry.productId,
      name: entry.name,
      sales: parseInt(entry.sales) || 0,
      category: entry.category || "N/A",
    }));

    // Worst Selling Products (Bottom 5 by quantity sold)
    const worstSellingProductsRaw = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: { order_date: dateRange },
          attributes: [],
        },
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("product.product_id"), "productId"],
        [Sequelize.col("product.name"), "name"],
        [Sequelize.col("product.category.name"), "category"],
        [Sequelize.fn("SUM", Sequelize.col("total_quantity")), "sales"],
      ],
      group: [
        "OrderItem.product_id",
        "product.product_id",
        "product.name",
        "product.category.category_id",
        "product.category.name",
      ],
      order: [[Sequelize.fn("SUM", Sequelize.col("total_quantity")), "ASC"]],
      limit: 5,
      raw: true,
    });

    const worstSellingProducts = worstSellingProductsRaw.map((entry) => ({
      productId: entry.productId,
      name: entry.name,
      sales: parseInt(entry.sales) || 0,
      category: entry.category || "N/A",
    }));

    // Product Rating Trends
    const ratingTrendsRaw = await ProductReview.findAll({
      where: { createdAt: dateRange },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "period"],
        [Sequelize.fn("AVG", Sequelize.col("rating")), "rating"],
        [
          Sequelize.fn("COUNT", Sequelize.col("product_review_id")),
          "reviewCount",
        ],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    const productRatingTrends = ratingTrendsRaw.map((entry) => ({
      period: formatDateToString(entry.period),
      rating: parseFloat(entry.rating || 0).toFixed(1),
      reviewCount: parseInt(entry.reviewCount) || 0,
    }));

    // Sales by Category (Revenue)
    const salesByCategoryRaw = await OrderItem.findAll({
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
          attributes: ["product_id"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("product.category.category_id"), "categoryId"],
        [Sequelize.col("product.category.name"), "category"],
        [
          Sequelize.fn("SUM", Sequelize.col("OrderItem.final_price")),
          "revenue",
        ],
      ],
      group: [
        "product.product_id",
        "product.category.category_id",
        "product.category.name"
      ],
      raw: true,
    });

    const salesByCategory = salesByCategoryRaw.reduce((acc, entry) => {
      if (entry.category) {
        acc[entry.category] = parseFloat(entry.revenue) || 0;
      }
      return acc;
    }, {});

    // Top Wishlisted Products
    const topWishlistedProductsRaw = await WishListItem.findAll({
      where: { createdAt: dateRange },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("product.product_id"), "productId"],
        [Sequelize.col("product.name"), "name"],
        [Sequelize.col("product.category.name"), "category"],
        [
          Sequelize.fn("COUNT", Sequelize.col("WishListItem.product_id")),
          "wishlistCount",
        ],
      ],
      group: [
        "WishListItem.product_id",
        "product.product_id",
        "product.name",
        "product.category.category_id",
        "product.category.name",
      ],
      order: [
        [
          Sequelize.fn("COUNT", Sequelize.col("WishListItem.product_id")),
          "DESC",
        ],
      ],
      limit: 5,
      raw: true,
    });

    const topWishlistedProducts = topWishlistedProductsRaw.map((entry) => ({
      productId: entry.productId,
      name: entry.name,
      wishlistCount: parseInt(entry.wishlistCount) || 0,
      category: entry.category || "N/A",
    }));

    // Out of Stock Products
    const outOfStockProductsRaw = await ProductVariant.findAll({
      where: { stock_quantity: 0 },
      include: [
        {
          model: Product,
          foreignKey: "product_id",
          attributes: ["product_id", "name"],
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
        [Sequelize.col("Product.product_id"), "productId"],
        [Sequelize.col("Product.name"), "name"],
        [Sequelize.col("Product.category.name"), "category"],
        "stock_quantity",
        "sku",
      ],
      limit: 10, // Limit to top 10 out of stock products
      raw: true,
    });

    const outOfStockProducts = outOfStockProductsRaw.map((entry) => ({
      productId: entry.productId,
      name: entry.name,
      stock: parseInt(entry.stock_quantity) || 0,
      category: entry.category || "N/A",
      sku: entry.sku || "N/A",
    }));

    // Low Stock Products (stock < 10 but > 0)
    const lowStockProductsRaw = await ProductVariant.findAll({
      where: {
        stock_quantity: {
          [Op.gt]: 0,
          [Op.lt]: 10,
        },
      },
      include: [
        {
          model: Product,
          foreignKey: "product_id",
          attributes: ["product_id", "name"],
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
        [Sequelize.col("Product.product_id"), "productId"],
        [Sequelize.col("Product.name"), "name"],
        [Sequelize.col("Product.category.name"), "category"],
        "stock_quantity",
        "sku",
      ],
      order: [["stock_quantity", "ASC"]],
      limit: 10, // Limit to top 10 low stock products
      raw: true,
    });

    const lowStockProducts = lowStockProductsRaw.map((entry) => ({
      productId: entry.productId,
      name: entry.name,
      stock: parseInt(entry.stock_quantity) || 0,
      category: entry.category || "N/A",
      sku: entry.sku || "N/A",
    }));

    // Response
    const responseData = {
      revenueOverTime,
      topSellingProducts,
      productRatingTrends,
      salesByCategory,
      worstSellingProducts,
      topWishlistedProducts,
      outOfStockProducts,
      lowStockProducts,
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching products analytics:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

const getCouponsAnalyticsData = async (req, res) => {
  try {
    // Parse query parameters
    const { period = "month", startDate, endDate } = req.query;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let dateRange = {};

    // Determine date range
    if (period === "day") {
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfDay, today] };
    } else if (period === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfWeek, today] };
    } else if (period === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateRange = { [Op.between]: [startOfMonth, today] };
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
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid period specified",
      });
    }

    // Coupon Usage Statistics
    const couponUsageRaw = await Coupon.findAll({
      where: {
        [Op.or]: [
          { createdAt: dateRange },
          { valid_from: dateRange },
          { valid_to: dateRange },
        ],
      },
      attributes: [
        "coupon_id",
        "code",
        "type",
        "discount_value",
        "usage_limit",
        "valid_from",
        "valid_to",
        "is_active",
      ],
      include: [
        {
          model: CouponRedemption,
          foreignKey: "coupon_id",
          attributes: [
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.col("CouponRedemptions.coupon_redemption_id")
              ),
              "redemptionCount",
            ],
            [
              Sequelize.fn(
                "SUM",
                Sequelize.col("CouponRedemptions.discount_amount")
              ),
              "totalDiscountAmount",
            ],
          ],
          include: [
            {
              model: Order,
              as: "order",
              where: { order_date: dateRange },
              attributes: [],
            },
          ],
          required: false,
        },
      ],
      group: [
        "Coupon.coupon_id",
        "Coupon.code",
        "Coupon.type",
        "Coupon.discount_value",
        "Coupon.usage_limit",
        "Coupon.valid_from",
        "Coupon.valid_to",
        "Coupon.is_active",
      ],
      raw: true,
    });

    const couponUsageStats = couponUsageRaw.map((entry) => ({
      couponId: entry.coupon_id,
      code: entry.code,
      type: entry.type,
      discountValue: parseFloat(entry.discount_value) || 0,
      usageLimit: parseInt(entry.usage_limit) || 0,
      redemptionCount:
        parseInt(entry["CouponRedemptions.redemptionCount"]) || 0,
      totalDiscountAmount:
        parseFloat(entry["CouponRedemptions.totalDiscountAmount"]) || 0,
      validFrom: formatDateToString(entry.valid_from),
      validTo: formatDateToString(entry.valid_to),
      isActive: entry.is_active,
      usageRate:
        entry.usage_limit > 0
          ? (
            ((parseInt(entry["CouponRedemptions.redemptionCount"]) || 0) /
              entry.usage_limit) *
            100
          ).toFixed(2)
          : "N/A",
    }));

    // Coupon Type Effectiveness
    const couponTypeRaw = await CouponRedemption.findAll({
      include: [
        {
          model: Coupon,
          as: "coupon",
          attributes: ["type"],
        },
        {
          model: Order,
          as: "order",
          where: { order_date: dateRange },
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.col("coupon.type"), "type"],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("CouponRedemption.coupon_redemption_id")
          ),
          "redemptionCount",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("CouponRedemption.discount_amount")
          ),
          "totalDiscountAmount",
        ],
        [
          Sequelize.fn(
            "AVG",
            Sequelize.col("CouponRedemption.discount_amount")
          ),
          "averageDiscountAmount",
        ],
      ],
      group: ["coupon.type"],
      raw: true,
    });

    const couponTypeEffectiveness = couponTypeRaw.reduce(
      (acc, entry) => {
        acc[entry.type] = {
          redemptionCount: parseInt(entry.redemptionCount) || 0,
          totalDiscountAmount: parseFloat(entry.totalDiscountAmount) || 0,
          averageDiscountAmount: parseFloat(entry.averageDiscountAmount) || 0,
        };
        return acc;
      },
      {
        percentage: {
          redemptionCount: 0,
          totalDiscountAmount: 0,
          averageDiscountAmount: 0,
        },
        fixed: {
          redemptionCount: 0,
          totalDiscountAmount: 0,
          averageDiscountAmount: 0,
        },
      }
    );

    // Expired/Unused Coupons
    const expiredUnusedRaw = await Coupon.findAll({
      where: {
        [Op.and]: [{ valid_to: { [Op.lt]: today } }, { is_active: true }],
      },
      attributes: [
        "coupon_id",
        "code",
        "type",
        "discount_value",
        "usage_limit",
        "valid_to",
      ],
      include: [
        {
          model: CouponRedemption,
          foreignKey: "coupon_id",
          attributes: [
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.col("CouponRedemptions.coupon_redemption_id")
              ),
              "redemptionCount",
            ],
          ],
          required: false,
        },
      ],
      group: [
        "Coupon.coupon_id",
        "Coupon.code",
        "Coupon.type",
        "Coupon.discount_value",
        "Coupon.usage_limit",
        "Coupon.valid_to",
      ],
      raw: true,
    });

    const expiredUnusedCoupons = expiredUnusedRaw
      .filter(
        (entry) => parseInt(entry["CouponRedemptions.redemptionCount"]) === 0
      )
      .map((entry) => ({
        couponId: entry.coupon_id,
        code: entry.code,
        type: entry.type,
        discountValue: parseFloat(entry.discount_value) || 0,
        usageLimit: parseInt(entry.usage_limit) || 0,
        expiryDate: formatDateToString(entry.valid_to),
        details: `${entry.type === "percentage"
            ? `${entry.discount_value}% off`
            : entry.type === "fixed"
              ? `$${entry.discount_value} off`
              : "Unknown discount type"
          }`,
      }));

    // Redemption Trends Over Time
    const redemptionTrendsRaw = await CouponRedemption.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: { order_date: dateRange },
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("order.order_date")), "date"],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("CouponRedemption.coupon_redemption_id")
          ),
          "redemptionCount",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("CouponRedemption.discount_amount")
          ),
          "totalDiscountAmount",
        ],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("order.order_date"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("order.order_date")), "ASC"]],
      raw: true,
    });

    const redemptionTrends = redemptionTrendsRaw.map((entry) => ({
      date: formatDateToString(entry.date),
      redemptionCount: parseInt(entry.redemptionCount) || 0,
      totalDiscountAmount: parseFloat(entry.totalDiscountAmount) || 0,
    }));

    // Top Performing Coupons
    const topPerformingCouponsRaw = await CouponRedemption.findAll({
      include: [
        {
          model: Coupon,
          as: "coupon",
          attributes: ["coupon_id", "code", "type", "discount_value"],
        },
        {
          model: Order,
          as: "order",
          where: { order_date: dateRange },
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.col("coupon.code"), "code"],
        [Sequelize.col("coupon.type"), "type"],
        [Sequelize.col("coupon.discount_value"), "discountValue"],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("CouponRedemption.coupon_redemption_id")
          ),
          "redemptionCount",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("CouponRedemption.discount_amount")
          ),
          "totalDiscountAmount",
        ],
      ],
      group: [
        "coupon.coupon_id",
        "coupon.code",
        "coupon.type",
        "coupon.discount_value",
      ],
      order: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("CouponRedemption.coupon_redemption_id")
          ),
          "DESC",
        ],
      ],
      limit: 10,
      raw: true,
    });

    const topPerformingCoupons = topPerformingCouponsRaw.map((entry) => ({
      code: entry.code,
      type: entry.type,
      discountValue: parseFloat(entry.discountValue) || 0,
      redemptionCount: parseInt(entry.redemptionCount) || 0,
      totalDiscountAmount: parseFloat(entry.totalDiscountAmount) || 0,
    }));

    // Response
    const responseData = {
      couponUsageStats,
      couponTypeEffectiveness,
      expiredUnusedCoupons,
      redemptionTrends,
      topPerformingCoupons,
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching coupons analytics:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default {
  getAnalyticsDashboardData,
  getProductsAnalyticsData,
  getCouponsAnalyticsData,
};
