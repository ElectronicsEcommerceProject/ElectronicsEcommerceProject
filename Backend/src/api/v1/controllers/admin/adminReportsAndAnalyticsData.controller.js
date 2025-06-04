import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import Sequelize from "sequelize";
import MESSAGE from "../../../../constants/message.js";

const { Op } = Sequelize;
const {
  Order,
  OrderItem,
  User,
  Product,
  ProductVariant,
  StockAlert,
  Brand,
  Category,
  ProductReview,
  CartItem,
  WishListItem,
  Coupon,
  CouponRedemption,
  ProductMedia,
  ProductMediaUrl,
  Cart,
} = db;

/**
 * Helper function to fetch product image data
 * @param {string} productId - The product ID
 * @param {object} req - Express request object for URL construction
 * @returns {object} Image data with id and url
 */
const getProductImage = async (productId, req) => {
  try {
    // First, find the product media
    const productMedia = await ProductMedia.findOne({
      where: { product_id: productId },
    });

    if (!productMedia) {
      return { id: null, url: null };
    }

    // Then, find the media URL
    const mediaUrl = await ProductMediaUrl.findOne({
      where: { product_media_id: productMedia.product_media_id },
    });

    if (!mediaUrl) {
      return { id: productMedia.product_media_id, url: null };
    }

    // Convert relative path to full URL
    let imageUrl = mediaUrl.product_media_url;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${req.protocol}://${req.get("host")}/${imageUrl.replace(
        /\\/g,
        "/"
      )}`;
    }

    return {
      id: productMedia.product_media_id,
      url: imageUrl,
    };
  } catch (error) {
    console.error("Error fetching product image:", error);
    return { id: null, url: null };
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
    if (!productIds || productIds.length === 0) {
      return {};
    }

    // Fetch all product media for the given product IDs
    const productMediaList = await ProductMedia.findAll({
      where: { product_id: { [Op.in]: productIds } },
    });

    // Create a map of productId to image data
    const imageMap = {};

    // For each product media, fetch the first URL
    for (const media of productMediaList) {
      const productId = media.product_id;

      // Get the first media URL for this product media
      const mediaUrl = await ProductMediaUrl.findOne({
        where: { product_media_id: media.product_media_id },
        attributes: ["product_media_url"],
      });

      let imageUrl = null;
      if (mediaUrl && mediaUrl.product_media_url) {
        imageUrl = mediaUrl.product_media_url;
        if (!imageUrl.startsWith("http")) {
          imageUrl = `${req.protocol}://${req.get("host")}/${imageUrl.replace(
            /\\/g,
            "/"
          )}`;
        }
      }

      imageMap[productId] = {
        id: media.product_media_id,
        url: imageUrl,
      };
    }

    // Fill in missing products with null values
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
    // Step 1: Parse query parameters for period
    const { period = "month", startDate, endDate } = req.query;

    // Step 2: Determine date range based on period
    const today = new Date("2025-06-04T23:59:59.999Z"); // Today's date (June 04, 2025, end of day IST)
    let dateRange = {};

    if (period === "today") {
      const startOfDay = new Date("2025-06-04T00:00:00.000Z");
      dateRange = {
        [Op.between]: [startOfDay, today],
      };
    } else if (period === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6); // 7 days including today
      startOfWeek.setHours(0, 0, 0, 0);
      dateRange = {
        [Op.between]: [startOfWeek, today],
      };
    } else if (period === "month" || !period) {
      const startOfMonth = new Date(today);
      startOfMonth.setDate(today.getDate() - 29); // 30 days including today
      startOfMonth.setHours(0, 0, 0, 0);
      dateRange = {
        [Op.between]: [startOfMonth, today],
      };
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
      dateRange = {
        [Op.between]: [customStart, customEnd],
      };
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid period specified",
      });
    }

    // Step 3: Fetch Sales Overview
    const orders = await Order.findAll({
      where: {
        order_date: dateRange,
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "totalRevenue"],
        [Sequelize.fn("COUNT", Sequelize.col("order_id")), "totalOrders"],
      ],
      raw: true,
    });

    const totalRevenue = parseFloat(orders[0].totalRevenue) || 0;
    const totalOrders = parseInt(orders[0].totalOrders) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Active Users: Distinct users who placed orders in the period
    const activeUsers = await Order.count({
      where: {
        order_date: dateRange,
      },
      distinct: true,
      col: "user_id",
    });

    // New User Registrations: Count of users registered in the period
    const newUserRegistrations = await User.count({
      where: {
        createdAt: dateRange,
      },
    });

    const salesOverview = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      activeUsers,
      newUserRegistrations,
    };

    // Step 4: Fetch Revenue Over Time
    const revenueData = await Order.findAll({
      where: {
        order_date: dateRange,
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("order_date")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "revenue"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("order_date"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("order_date")), "ASC"]],
      raw: true,
    });

    const revenueLabels = revenueData.map(
      (entry) => entry.date.toISOString().split("T")[0]
    );
    const revenueValues = revenueData.map((entry) => parseFloat(entry.revenue));

    const revenueOverTime = {
      labels: revenueLabels,
      data: revenueValues,
    };

    // Step 5: Fetch Order Status Distribution
    const orderStatusData = await Order.findAll({
      where: {
        order_date: dateRange,
      },
      attributes: [
        "order_status",
        [Sequelize.fn("COUNT", Sequelize.col("order_id")), "count"],
      ],
      group: ["order_status"],
      raw: true,
    });

    const orderStatusDistribution = {
      pending: 0,
      shipped: 0,
      completed: 0,
      canceled: 0,
    };

    orderStatusData.forEach((entry) => {
      const status = entry.order_status.toLowerCase();
      if (orderStatusDistribution.hasOwnProperty(status)) {
        orderStatusDistribution[status] = parseInt(entry.count);
      }
    });

    // Step 6: Fetch Top-Selling Products (Top 5)
    const topSellingProductsRaw = await OrderItem.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: {
            order_date: dateRange,
          },
          attributes: [],
        },
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name"],
        },
      ],
      attributes: [
        [Sequelize.col("product.product_id"), "productId"],
        [Sequelize.col("product.name"), "productName"],
        [Sequelize.fn("SUM", Sequelize.col("total_quantity")), "unitsSold"],
      ],
      group: ["OrderItem.product_id", "product.product_id", "product.name"],
      order: [[Sequelize.fn("SUM", Sequelize.col("total_quantity")), "DESC"]],
      limit: 5,
      raw: true,
    });

    // Get product IDs for image fetching
    const topSellingProductIds = topSellingProductsRaw.map(
      (entry) => entry.productId
    );

    // Fetch images for top-selling products
    const topSellingProductImages = await getMultipleProductImages(
      topSellingProductIds,
      req
    );

    const topSellingProducts = topSellingProductsRaw.map((entry) => ({
      productId: entry.productId,
      productName: entry.productName,
      unitsSold: parseInt(entry.unitsSold),
      image: topSellingProductImages[entry.productId] || {
        id: null,
        url: null,
      },
    }));

    // Step 7: Fetch Low Stock Products (stock_quantity < 10)
    const lowStockProducts = await ProductVariant.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_id", "name"],
        },
      ],
      where: {
        stock_quantity: {
          [Op.lt]: 10,
        },
      },
      attributes: [
        [Sequelize.col("Product.product_id"), "productId"],
        [Sequelize.col("Product.name"), "productName"],
        "product_variant_id",
        "sku",
        "stock_quantity",
      ],
      raw: true,
    });

    // Get unique product IDs for image fetching
    const lowStockProductIds = [
      ...new Set(lowStockProducts.map((entry) => entry.productId)),
    ];

    // Fetch images for low stock products
    const lowStockProductImages = await getMultipleProductImages(
      lowStockProductIds,
      req
    );

    const formattedLowStockProducts = lowStockProducts.map((entry) => ({
      productId: entry.productId,
      productName: entry.productName,
      variantId: entry.product_variant_id,
      sku: entry.sku || "N/A",
      stockQuantity: entry.stock_quantity,
      image: lowStockProductImages[entry.productId] || { id: null, url: null },
    }));

    // Step 8: Fetch Recent Orders (Last 5)
    const recentOrdersRaw = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
      where: {
        order_date: dateRange,
      },
      attributes: ["order_id", "total_amount", "order_status", "order_date"],
      order: [["order_date", "DESC"]],
      limit: 5,
      raw: true,
    });

    const recentOrders = recentOrdersRaw.map((order) => ({
      orderId: order.order_id,
      customerName: `${order["user.name"]}`.trim(),
      totalAmount: parseFloat(order.total_amount),
      status: order.order_status,
      date: order.order_date.toISOString().split("T")[0],
    }));

    // Step 9: Fetch Stock Alerts
    const stockAlertsRaw = await StockAlert.findAll({
      where: {
        status: "pending",
        createdAt: dateRange,
      },
      include: [
        {
          model: Product,
          attributes: ["name"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku"],
        },
      ],
      attributes: ["status"],
      raw: true,
    });

    const totalAlerts = stockAlertsRaw.length;
    const alertedProducts = stockAlertsRaw.map((alert) => ({
      productName: alert["Product.name"],
      variantId: alert["ProductVariant.product_variant_id"],
      sku: alert["ProductVariant.sku"] || "N/A",
      alertStatus: alert.status,
    }));

    const stockAlerts = {
      totalAlerts,
      alertedProducts,
    };

    // Step 10: Fetch Brand Distribution (Revenue by Brand)
    const brandDistributionRaw = await Order.findAll({
      where: {
        order_date: dateRange,
      },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          attributes: [],
          include: [
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
        },
      ],
      attributes: [
        [Sequelize.col("orderItems.product.brand.name"), "brandName"],
        [Sequelize.fn("SUM", Sequelize.col("Order.total_amount")), "revenue"],
      ],
      group: [
        "orderItems.product.brand.brand_id",
        "orderItems.product.brand.name",
      ],
      raw: true,
    });

    const brandDistribution = {};
    brandDistributionRaw.forEach((entry) => {
      if (entry.brandName) {
        brandDistribution[entry.brandName] = parseFloat(entry.revenue);
      }
    });

    // Step 11: Fetch Category Distribution (Revenue by Category)
    const categoryDistributionRaw = await Order.findAll({
      where: {
        order_date: dateRange,
      },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          attributes: [],
          include: [
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
        },
      ],
      attributes: [
        [Sequelize.col("orderItems.product.category.name"), "categoryName"],
        [Sequelize.fn("SUM", Sequelize.col("Order.total_amount")), "revenue"],
      ],
      group: [
        "orderItems.product.category.category_id",
        "orderItems.product.category.name",
      ],
      raw: true,
    });

    const categoryDistribution = {};
    categoryDistributionRaw.forEach((entry) => {
      if (entry.categoryName) {
        categoryDistribution[entry.categoryName] = parseFloat(entry.revenue);
      }
    });

    // Step 12: Fetch Customer Satisfaction Score (via ProductReview)
    const reviews = await ProductReview.findAll({
      where: {
        createdAt: dateRange,
      },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        "rating",
        [Sequelize.fn("COUNT", Sequelize.col("rating")), "count"],
      ],
      group: ["rating"],
      raw: true,
    });

    const totalReviews = reviews.reduce(
      (sum, entry) => sum + parseInt(entry.count),
      0
    );
    const averageRating =
      parseFloat(
        reviews.reduce(
          (sum, entry) =>
            sum + parseFloat(entry.averageRating) * parseInt(entry.count),
          0
        ) / totalReviews
      ) || 0;

    const ratingDistributionRaw = {};
    reviews.forEach((entry) => {
      ratingDistributionRaw[entry.rating] = parseInt(entry.count);
    });

    const ratingDistribution = {
      5:
        totalReviews > 0
          ? ((ratingDistributionRaw["5"] || 0) / totalReviews) * 100
          : 0,
      4:
        totalReviews > 0
          ? ((ratingDistributionRaw["4"] || 0) / totalReviews) * 100
          : 0,
      3:
        totalReviews > 0
          ? ((ratingDistributionRaw["3"] || 0) / totalReviews) * 100
          : 0,
      2:
        totalReviews > 0
          ? ((ratingDistributionRaw["2"] || 0) / totalReviews) * 100
          : 0,
      1:
        totalReviews > 0
          ? ((ratingDistributionRaw["1"] || 0) / totalReviews) * 100
          : 0,
    };

    const customerSatisfaction = {
      averageRating: parseFloat(averageRating.toFixed(2)),
      ratingDistribution,
    };

    // Step 13: Fetch Abandoned Cart Rate
    // Get total unique users who added items to cart in the period
    const totalCartsUsers = await CartItem.findAll({
      where: {
        createdAt: dateRange,
      },
      include: [
        {
          model: Cart,
          as: "cart",
          attributes: ["user_id"],
        },
      ],
      attributes: [[Sequelize.col("cart.user_id"), "userId"]],
      group: ["cart.user_id"],
      raw: true,
    });

    const totalCarts = totalCartsUsers.length;

    // Get users who placed orders in the same period
    const usersWhoOrdered = await Order.findAll({
      where: {
        order_date: dateRange,
      },
      attributes: ["user_id"],
      group: ["user_id"],
      raw: true,
    });

    const orderedUserIds = new Set(
      usersWhoOrdered.map((order) => order.user_id)
    );
    const cartUserIds = totalCartsUsers.map((cart) => cart.userId);

    // Count how many cart users actually placed orders
    const convertedCarts = cartUserIds.filter((userId) =>
      orderedUserIds.has(userId)
    ).length;

    const abandonedCartRate =
      totalCarts > 0 ? ((totalCarts - convertedCarts) / totalCarts) * 100 : 0;

    // Step 14: Fetch Top Wishlisted Products (Top 5)
    const topWishlistedProductsRaw = await WishListItem.findAll({
      where: {
        createdAt: dateRange,
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name"],
        },
      ],
      attributes: [
        [Sequelize.col("product.product_id"), "productId"],
        [Sequelize.col("product.name"), "productName"],
        [
          Sequelize.fn("COUNT", Sequelize.col("WishListItem.product_id")),
          "wishlistCount",
        ],
      ],
      group: ["WishListItem.product_id", "product.product_id", "product.name"],
      order: [
        [
          Sequelize.fn("COUNT", Sequelize.col("WishListItem.product_id")),
          "DESC",
        ],
      ],
      limit: 5,
      raw: true,
    });

    // Get product IDs for image fetching
    const topWishlistedProductIds = topWishlistedProductsRaw.map(
      (entry) => entry.productId
    );

    // Fetch images for top wishlisted products
    const topWishlistedProductImages = await getMultipleProductImages(
      topWishlistedProductIds,
      req
    );

    const topWishlistedProducts = topWishlistedProductsRaw.map((entry) => ({
      productId: entry.productId,
      productName: entry.productName,
      wishlistCount: parseInt(entry.wishlistCount),
      image: topWishlistedProductImages[entry.productId] || {
        id: null,
        url: null,
      },
    }));

    // Step 15: Fetch Coupon Usage
    const couponUsageRaw = await CouponRedemption.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: {
            order_date: dateRange,
          },
          attributes: [],
        },
        {
          model: Coupon,
          as: "coupon",
          attributes: ["code"],
        },
      ],
      attributes: [
        [Sequelize.col("coupon.code"), "couponCode"],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("CouponRedemption.coupon_redemption_id")
          ),
          "usageCount",
        ],
      ],
      group: ["CouponRedemption.coupon_id", "coupon.coupon_id", "coupon.code"],
      raw: true,
    });

    const couponUsage = couponUsageRaw.map((entry) => ({
      couponCode: entry.couponCode,
      usageCount: parseInt(entry.usageCount),
    }));

    // Step 16: Combine all data into the response
    const responseData = {
      salesOverview,
      revenueOverTime,
      orderStatusDistribution,
      topSellingProducts,
      lowStockProducts: formattedLowStockProducts,
      recentOrders,
      stockAlerts,
      brandDistribution,
      categoryDistribution,
      customerSatisfaction,
      abandonedCartRate: parseFloat(abandonedCartRate.toFixed(2)),
      topWishlistedProducts,
      couponUsage,
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
