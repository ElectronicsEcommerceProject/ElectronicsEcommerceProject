import db from '../../../../models/index.js';
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";
import { io } from "../../utils/socket.js"; 

const { Notification, User } = db;

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const { userID } = req;
    console.log(userID, "userID in getUserNotifications");
    
    // Verify user exists
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    const notifications = await Notification.findAll({
      where: { 
        user_id: userID,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        }
      ]
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: notifications,
    });
  } catch (err) {
    console.error("❌ Error in getUserNotifications:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notification_id } = req.body;
    const { userID } = req;
    
    const notification = await Notification.findByPk(notification_id);
    
    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Notification not found",
      });
    }
    
    // Check if user has permission to mark this notification as read
    if (notification.user_id && notification.user_id !== userID) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You don't have permission to update this notification",
      });
    }
    
    notification.is_read = true;
    await notification.save();
    
    return res.status(StatusCodes.OK).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (err) {
    console.error("❌ Error in markNotificationAsRead:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to mark notification as read",
      error: err.message,
    });
  }
};

// Create and broadcast notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, audience, user_id } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: MESSAGE.custom("Title and message are required."),
      });
    }

    // Get the creator (admin) from the token
    const creator = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!creator) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: MESSAGE.custom("Unauthorized: Only admin can create notifications."),
      });
    }

    // Determine target users based on audience
    let targetUsers = [];
    if (audience === "retailer") {
      targetUsers = await User.findAll({ where: { role: "retailer" } });
    } else if (audience === "customer") {
      targetUsers = await User.findAll({ where: { role: "customer" } });
    } else if (audience === "specific" && user_id) {
      const specificUser = await User.findByPk(user_id);
      if (!specificUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: MESSAGE.custom("User not found for the specified user_id."),
        });
      }
      targetUsers = [specificUser];
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: MESSAGE.custom("Invalid audience specified."),
      });
    }

    if (!targetUsers || targetUsers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.custom("No users found for the specified audience."),
      });
    }

    // Create notifications for each target user
    const notifications = await Promise.all(
      targetUsers.map((user) =>
        Notification.create({
          title,
          message,
          type: type || "info",
          user_id: user.user_id,
          created_by: creator.user_id,
        })
      )
    );

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Error in createNotification:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};


export default {
  getUserNotifications,
  markNotificationAsRead,
  createNotification
};