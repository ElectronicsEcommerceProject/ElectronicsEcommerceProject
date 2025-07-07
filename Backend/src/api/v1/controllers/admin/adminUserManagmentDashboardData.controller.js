import { Op, Sequelize } from "sequelize";
import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

const { User, Order, Product, OrderItem } = db;

/**
 * Retrieves dashboard data related to user management metrics
 * - User counts by different statuses and roles
 * - Orders and revenue metrics
 * - Top buyers
 */
const getUserManagementDashboardData = async (req, res) => {
  try {
    // Get the date range for new signups (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Convert to proper ISO format for database query
    const startDate = sevenDaysAgo.toISOString().split("T")[0] + " 00:00:00";
    const endDate = today.toISOString().split("T")[0] + " 23:59:59";

    // Execute queries in parallel for better performance
    const [
      totalUsers,
      activeCustomers,
      activeRetailers,
      activeUsers,
      suspendedUsers,
      pendingRetailers,
      newSignups,
      totalOrdersResult,
      totalRevenueResult,
    ] = await Promise.all([
      // 1. Total Users
      User.count(),

      // 2. Active Customers
      User.count({
        where: { role: "customer", status: "active" },
      }),

      // 3. Active Retailers
      User.count({
        where: { role: "retailer", status: "active" },
      }),

      // 4. Active Users
      User.count({
        where: { status: "active" },
      }),

      // 5. Suspended Users
      User.count({
        where: { status: "banned" },
      }),

      // 6. Pending Retailers
      User.count({
        where: { role: "retailer", status: "inactive" },
      }),

      // 7. New Signups (last 7 days)
      User.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      }),

      // 8. Total orders for average calculation
      Order.count(),

      // 9. Total revenue for average calculation
      Order.sum("total_amount"),
    ]);

    // 10. Top Buyers (by Total Spend)
    const topBuyers = await User.findAll({
      attributes: ["user_id", "name"],
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [],
        },
      ],
      group: ["User.user_id", "User.name"],
      order: [[Sequelize.literal("total_spend"), "DESC"]],
      limit: 3,
      raw: true,
      having: Sequelize.literal("COUNT(Orders.order_id) > 0"),
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn("SUM", Sequelize.col("orders.total_amount")),
            "total_spend",
          ],
          [
            Sequelize.fn("COUNT", Sequelize.col("Orders.order_id")),
            "order_count",
          ],
        ],
      },
    });

    // Format the response
    const formattedTopBuyers = topBuyers.map((buyer) => ({
      name: buyer.name,
      totalSpend: parseFloat(buyer.total_spend || 0),
      orders: parseInt(buyer.order_count || 0),
    }));

    // Calculate averages
    const avgOrdersPerUser =
      activeUsers > 0
        ? Number((totalOrdersResult / activeUsers).toFixed(1))
        : 0;
    const avgRevenuePerUser =
      activeUsers > 0 ? Math.round(totalRevenueResult / activeUsers) : 0;

    // Format the response to match the dashboard
    const response = {
      totalUsers,
      activeCustomers,
      activeRetailers,
      activeUsers,
      suspendedUsers,
      pendingRetailers,
      newSignups,
      avgOrdersPerUser,
      avgRevenuePerUser,
      topBuyers: formattedTopBuyers,
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

const getUsersOrdersData = async (req, res) => {
  try {
    // Get all users with their basic order statistics
    const usersWithOrderStats = await User.findAll({
      attributes: [
        "user_id",
        "name",
        "email",
        "role",
        "status",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("orders.order_id")), "orderCount"],
        [
          Sequelize.fn("SUM", Sequelize.col("orders.total_amount")),
          "totalSpent",
        ],
      ],
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [],
          required: false, // Use LEFT JOIN to include users with no orders
        },
      ],
      group: ["User.user_id"],
      order: [[Sequelize.literal("totalSpent"), "DESC"]],
    });

    // Get order status counts for each user
    const userIds = usersWithOrderStats.map((user) => user.user_id);

    // Get order status counts for all users in a single query
    const orderStatusCounts = await Order.findAll({
      attributes: [
        "user_id",
        "order_status",
        [Sequelize.fn("COUNT", Sequelize.col("order_id")), "count"],
      ],
      where: {
        user_id: {
          [Op.in]: userIds,
        },
      },
      group: ["user_id", "order_status"],
      raw: true,
    });

    // Create a map of user_id to status counts
    const statusCountsByUser = {};
    orderStatusCounts.forEach((item) => {
      if (!statusCountsByUser[item.user_id]) {
        statusCountsByUser[item.user_id] = {};
      }
      statusCountsByUser[item.user_id][item.order_status] = parseInt(
        item.count
      );
    });

    // Format the response with order status counts
    const formattedUsers = usersWithOrderStats.map((user) => {
      const plainUser = user.get({ plain: true });
      const userId = plainUser.user_id;
      const statusCounts = statusCountsByUser[userId] || {};

      return {
        ...plainUser,
        orderCount: parseInt(plainUser.orderCount || 0),
        totalSpent: parseFloat(plainUser.totalSpent || 0),
        orderStatusCounts: {
          pending: statusCounts.pending || 0,
          processing: statusCounts.processing || 0,
          shipped: statusCounts.shipped || 0,
          delivered: statusCounts.delivered || 0,
          cancelled: statusCounts.cancelled || 0,
          returned: statusCounts.returned || 0,
        },
      };
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users and orders data:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default { getUserManagementDashboardData, getUsersOrdersData };
