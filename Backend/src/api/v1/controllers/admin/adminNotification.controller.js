import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { Notification, NotificationTemplate, User } = db;

// Add Notification Controller
export const addNotification = async (req, res) => {
  try {
    const {
      targetAudience,
      channel,
      templateId,
      title,
      message,
      specificUserIds,
    } = req.body;

    const adminId = req.user.user_id;

    // Validate required fields
    if (!targetAudience || !channel || !title || !message) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.custom(
          "Missing required fields: targetAudience, channel, title, and message are required"
        ),
      });
    }

    // Map frontend channel values to backend enum values
    const channelMap = {
      Email: "email",
      SMS: "sms",
      "In app SMS": "in_app",
    };

    // Map frontend audience values to backend enum values
    const audienceMap = {
      "All Users": "all_users",
      "All Customers": "all_customers",
      "All Retailers": "all_retailers",
      "Specific Customers": "specific_users",
      "Specific Retailers": "specific_users",
    };

    const mappedChannel = channelMap[channel] || "in_app";
    const mappedAudience = audienceMap[targetAudience] || "all_users";

    // Get target users based on audience type
    let targetUsers = [];

    if (mappedAudience === "all_users") {
      targetUsers = await User.findAll({
        where: { deletedAt: null },
        attributes: ["user_id"],
      });
    } else if (mappedAudience === "all_customers") {
      targetUsers = await User.findAll({
        where: {
          role: "customer",
          deletedAt: null,
        },
        attributes: ["user_id"],
      });
    } else if (mappedAudience === "all_retailers") {
      targetUsers = await User.findAll({
        where: {
          role: "retailer",
          deletedAt: null,
        },
        attributes: ["user_id"],
      });
    } else if (
      mappedAudience === "specific_users" &&
      specificUserIds?.length > 0
    ) {
      targetUsers = await User.findAll({
        where: {
          user_id: { [Op.in]: specificUserIds },
          deletedAt: null,
        },
        attributes: ["user_id"],
      });
    }

    if (targetUsers.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }

    // Create notifications for each target user
    const notifications = targetUsers.map((user) => ({
      user_id: user.user_id,
      template_id: templateId || null,
      title,
      message,
      channel: mappedChannel,
      status: "sent", // Assuming immediate send for demo
      created_by: adminId,
      audience_type: mappedAudience,
    }));

    const createdNotifications = await Notification.bulkCreate(notifications);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: {
        count: createdNotifications.length,
        notifications: createdNotifications,
      },
    });
  } catch (error) {
    console.error("Add notification error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// Get Notification Logs with Filtering
export const getNotificationLogs = async (req, res) => {
  try {
    const {
      channel,
      status,
      audience,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (channel && channel !== "All Channels") {
      const channelMap = {
        Email: "email",
        SMS: "sms",
        "In app SMS": "in_app",
      };
      whereClause.channel = channelMap[channel] || channel.toLowerCase();
    }

    if (status && status !== "All Statuses") {
      whereClause.status = status.toLowerCase();
    }

    if (audience && audience !== "All Audiences") {
      const audienceMap = {
        "All Users": "all_users",
        "All Customers": "all_customers",
        "All Retailers": "all_retailers",
      };
      whereClause.audience_type = audienceMap[audience] || audience;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          foreignKey: "created_by",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: NotificationTemplate,
          foreignKey: "template_id",
          attributes: ["template_id", "name", "type"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Format response to match frontend expectations
    const formattedLogs = notifications.map((notification) => ({
      id: notification.notification_id,
      date: notification.createdAt.toLocaleString(),
      sentBy: notification.User?.name || "Unknown",
      audience: formatAudienceType(notification.audience_type),
      channel: formatChannelType(notification.channel),
      status: notification.status === "sent" ? "Sent" : "Failed",
      message: notification.message,
      title: notification.title,
    }));

    // Calculate statistics
    const stats = await calculateNotificationStats(whereClause);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        logs: formattedLogs,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Get notification logs error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get Notification Statistics
export const getNotificationStats = async (req, res) => {
  try {
    const { channel, audience, startDate, endDate } = req.query;
    const whereClause = {};

    // Apply filters for stats
    if (channel && channel !== "All Channels") {
      const channelMap = {
        Email: "email",
        SMS: "sms",
        "In app SMS": "in_app",
      };
      whereClause.channel = channelMap[channel] || channel.toLowerCase();
    }

    if (audience && audience !== "All Audiences") {
      const audienceMap = {
        "All Users": "all_users",
        "All Customers": "all_customers",
        "All Retailers": "all_retailers",
      };
      whereClause.audience_type = audienceMap[audience] || audience;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const stats = await calculateNotificationStats(whereClause);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: { stats },
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Helper function to calculate notification statistics
const calculateNotificationStats = async (whereClause) => {
  const total = await Notification.count({ where: whereClause });
  const successful = await Notification.count({
    where: { ...whereClause, status: "sent" },
  });
  const failed = await Notification.count({
    where: { ...whereClause, status: "failed" },
  });
  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

  return {
    total,
    successful,
    failed,
    successRate,
  };
};

// Helper function to format audience type for frontend
const formatAudienceType = (audienceType) => {
  const formatMap = {
    all_users: "All Users",
    all_customers: "All Customers",
    all_retailers: "All Retailers",
    specific_users: "Specific Users",
  };
  return formatMap[audienceType] || audienceType;
};

// Helper function to format channel type for frontend
const formatChannelType = (channel) => {
  const formatMap = {
    email: "Email",
    sms: "SMS",
    in_app: "In app SMS",
  };
  return formatMap[channel] || channel;
};

// Template Management Controllers

// Get All Templates
export const getTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (type && type !== "All Types") {
      const typeMap = {
        Email: "email",
        SMS: "sms",
        "In app SMS": "in_app",
      };
      whereClause.type = typeMap[type] || type.toLowerCase();
    }

    const { count, rows: templates } =
      await NotificationTemplate.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            foreignKey: "created_by",
            attributes: ["user_id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

    // Format response to match frontend expectations
    const formattedTemplates = templates.map((template) => ({
      id: template.template_id,
      name: template.name,
      type: formatChannelType(template.type),
      content: template.content,
      created: template.createdAt.toLocaleDateString(),
      createdBy: template.User?.name || "Unknown",
    }));

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        templates: formattedTemplates,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Create Template
export const createTemplate = async (req, res) => {
  try {
    const { name, type, content } = req.body;
    const adminId = req.user.user_id;

    // Validate required fields
    if (!name || !type || !content) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.custom(
          "Missing required fields: name, type, and content are required"
        ),
      });
    }

    // Map frontend type to backend enum
    const typeMap = {
      Email: "email",
      SMS: "sms",
      "In app SMS": "in_app",
    };
    const mappedType = typeMap[type] || type.toLowerCase();

    // Check if template name already exists
    const existingTemplate = await NotificationTemplate.findOne({
      where: { name, deletedAt: null },
    });

    if (existingTemplate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.post.sameEntry,
      });
    }

    const newTemplate = await NotificationTemplate.create({
      name,
      type: mappedType,
      content,
      created_by: adminId,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: {
        template: {
          id: newTemplate.template_id,
          name: newTemplate.name,
          type: formatChannelType(newTemplate.type),
          content: newTemplate.content,
          created: newTemplate.createdAt.toLocaleDateString(),
        },
      },
    });
  } catch (error) {
    console.error("Create template error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// Update Template
export const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, type, content } = req.body;
    const adminId = req.user.user_id;

    // Validate required fields
    if (!name || !type || !content) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.custom(
          "Missing required fields: name, type, and content are required"
        ),
      });
    }

    const template = await NotificationTemplate.findByPk(templateId);
    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.none,
      });
    }

    // Map frontend type to backend enum
    const typeMap = {
      Email: "email",
      SMS: "sms",
      "In app SMS": "in_app",
    };
    const mappedType = typeMap[type] || type.toLowerCase();

    // Check if new name conflicts with existing template (excluding current)
    if (name !== template.name) {
      const existingTemplate = await NotificationTemplate.findOne({
        where: {
          name,
          template_id: { [Op.ne]: templateId },
          deletedAt: null,
        },
      });

      if (existingTemplate) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: MESSAGE.post.sameEntry,
        });
      }
    }

    await template.update({
      name,
      type: mappedType,
      content,
      updated_by: adminId,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      data: {
        template: {
          id: template.template_id,
          name: template.name,
          type: formatChannelType(template.type),
          content: template.content,
          created: template.createdAt.toLocaleDateString(),
        },
      },
    });
  } catch (error) {
    console.error("Update template error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// Delete Template
export const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await NotificationTemplate.findByPk(templateId);
    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.none,
      });
    }

    // Check if template is being used in any notifications
    const notificationsUsingTemplate = await Notification.count({
      where: { template_id: templateId, deletedAt: null },
    });

    if (notificationsUsingTemplate > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.custom(
          "Cannot delete template as it is being used in notifications"
        ),
      });
    }

    await template.destroy();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Delete template error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};
