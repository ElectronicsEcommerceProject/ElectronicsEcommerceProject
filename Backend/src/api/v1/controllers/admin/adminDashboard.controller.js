import { Op, Sequelize } from "sequelize";
import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

const { User, Order, Product, OrderItem, ProductVariant, StockAlert } = db;

/**
 * Retrieves dashboard data for the admin panel
 * - Total users (customers, retailers, admins)
 * - Total orders (all, pending, delivered, cancelled)
 * - Total revenue (last 30 days, last 7 days, today) excluding cancelled orders
 * - Low stock alerts (all pending alerts with stock below threshold)
 * - Top selling products
 * - Latest orders (customer and retailer)
 */
const getAdminDashboardData = async (req, res) => {
  try {
    // Date ranges for revenue calculations
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    // Last 7 days
    const startOfLast7Days = new Date(today);
    startOfLast7Days.setDate(today.getDate() - 7);
    startOfLast7Days.setHours(0, 0, 0, 0);

    // Last 30 days
    const startOfLast30Days = new Date(today);
    startOfLast30Days.setDate(today.getDate() - 30);
    startOfLast30Days.setHours(0, 0, 0, 0);

    // Execute queries in parallel for performance
    const [
      totalCustomers,
      totalRetailers,
      totalAdmins,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      last30DaysRevenue,
      last7DaysRevenue,
      todayRevenue,
      lowStockAlerts,
      topSellingProducts,
      latestCustomerOrders,
      latestRetailerOrders,
    ] = await Promise.all([
      // 1. Total Customers
      User.count({
        where: { role: "customer" },
      }),

      // 2. Total Retailers
      User.count({
        where: { role: "retailer" },
      }),

      // 3. Total Admins
      User.count({
        where: { role: "admin" },
      }),

      // 4. Total Orders
      Order.count(),

      // 5. Pending Orders
      Order.count({
        where: { order_status: "pending" },
      }),

      // 6. Delivered Orders
      Order.count({
        where: { order_status: "delivered" },
      }),

      // 7. Cancelled Orders
      Order.count({
        where: { order_status: "cancelled" },
      }),

      // 8. Last 30 Days Revenue (excluding cancelled orders)
      Order.sum("total_amount", {
        where: {
          order_date: {
            [Op.gte]: startOfLast30Days,
            [Op.lte]: endOfToday,
          },
          order_status: { [Op.ne]: "cancelled" },
        },
      }) || 0,

      // 9. Last 7 Days Revenue (excluding cancelled orders)
      Order.sum("total_amount", {
        where: {
          order_date: {
            [Op.gte]: startOfLast7Days,
            [Op.lte]: endOfToday,
          },
          order_status: { [Op.ne]: "cancelled" },
        },
      }) || 0,

      // 10. Today Revenue (excluding cancelled orders)
      Order.sum("total_amount", {
        where: {
          order_date: {
            [Op.between]: [startOfToday, endOfToday],
          },
          order_status: { [Op.ne]: "cancelled" },
        },
      }) || 0,

      // 11. Low Stock Alerts (all pending alerts with stock below threshold)
      StockAlert.findAll({
        include: [
          {
            model: Product,
            attributes: ["name", "product_id"],
            required: true,
          },
          {
            model: ProductVariant,
            attributes: ["product_variant_id", "stock_quantity", "sku"],
            required: true,
          },
        ],
        where: {
          stock_level: { [Op.lte]: 10 }, // Threshold of 10 units
        },
        order: [["stock_level", "ASC"]], // Lowest stock first
        limit: 5,
      }),

      // 12. Top Selling Products (by quantity sold)
      Product.findAll({
        attributes: ["name"],
        include: [
          {
            model: OrderItem,
            as: "orderItem",
            attributes: [],
          },
        ],
        group: ["Product.product_id", "Product.name"],
        order: [[Sequelize.literal("total_sold"), "DESC"]],
        limit: 5,
        raw: true,
        having: Sequelize.literal("SUM(`orderItems`.`total_quantity`) > 0"),
        subQuery: false,
        attributes: {
          include: [
            [
              Sequelize.fn("SUM", Sequelize.col("orderItems.total_quantity")),
              "total_sold",
            ],
          ],
        },
      }),

      // 13. Latest Customer Orders
      Order.findAll({
        include: [
          {
            model: User,
            as: "user",
            where: { role: "customer" },
            attributes: [],
          },
        ],
        order: [["order_date", "DESC"]],
        limit: 5,
      }),

      // 14. Latest Retailer Orders
      Order.findAll({
        include: [
          {
            model: User,
            as: "user",
            where: { role: "retailer" },
            attributes: [],
          },
        ],
        order: [["order_date", "DESC"]],
        limit: 5,
      }),
    ]);

    // Format Low Stock Alerts
    const formattedLowStockAlerts = lowStockAlerts.map((alert) => ({
      productName: alert.Product ? alert.Product.name : "Unknown Product",
      stockLeft: alert.stock_level,
      variantName: alert.ProductVariant
        ? alert.ProductVariant.variant_name
        : "",
      productId: alert.product_id,
      variantId: alert.product_variant_id,
    }));

    // Format Top Selling Products
    const formattedTopSellingProducts = topSellingProducts.map((product) => ({
      productName: product.name,
      sold: parseInt(product.total_sold || 0),
    }));

    // Format Latest Orders
    const formattedCustomerOrders = latestCustomerOrders.length
      ? latestCustomerOrders.map((order) => ({
        orderId: order.order_number,
        status: order.order_status,
        total: order.total_amount,
      }))
      : "No customer orders found.";

    const formattedRetailerOrders = latestRetailerOrders.length
      ? latestRetailerOrders.map((order) => ({
        orderId: order.order_number,
        status: order.order_status,
        total: order.total_amount,
      }))
      : "No retailer orders found.";

    // Format the response
    const response = {
      totalUsers: {
        customers: totalCustomers,
        retailers: totalRetailers,
        admins: totalAdmins,
      },
      totalOrders: {
        all: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      totalRevenue: {
        last30Days: last30DaysRevenue || 0,
        last7Days: last7DaysRevenue || 0,
        today: todayRevenue || 0,
      },
      lowStockAlerts: formattedLowStockAlerts,
      topSellingProducts: formattedTopSellingProducts,
      latestOrders: {
        customerOrders: formattedCustomerOrders,
        retailerOrders: formattedRetailerOrders,
      },
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default { getAdminDashboardData };
