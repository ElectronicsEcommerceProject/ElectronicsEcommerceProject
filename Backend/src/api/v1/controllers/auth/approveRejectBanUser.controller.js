// Controller for retailer approval management
import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
import { Sequelize } from "sequelize";

const { User } = db;

const approveUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }
    
    if (user.status === 'active') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.post.sameEntry,
      });
    }
    
    await user.update({ status: 'active' });
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
    });
  } catch (error) {
    console.error(`Error approving user ${req.params.user_id}:`, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

/**
 * Reject a user (change status to inactive)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const rejectUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { notes } = req.body;
    
    // Find the user
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }
    
    if (user.status === 'inactive') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.post.sameEntry,
      });
    }
    
    // Update with notes if provided
    const updateData = { status: 'inactive' };
    if (notes) {
      updateData.admin_notes = notes;
    }
    
    await user.update(updateData);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
    });
  } catch (error) {
    console.error(`Error rejecting user ${req.params.user_id}:`, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

/**
 * Ban a user (change status to banned)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const banUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { reason } = req.body;
    
    // Find the user
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }
    
    // Check if user is already banned
    if (user.status === 'banned') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.post.sameEntry,
      });
    }
    
    if (!reason) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.custom("Ban reason is required"),
      });
    }
    
    await user.update({ status: 'banned', ban_reason: reason });
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
    });
  } catch (error) {
    console.error(`Error banning user ${req.params.user_id}:`, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

/**
 * Change user status (to any valid status)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
/**
 * Get all retailers with inactive status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPendingRetailers = async (req, res) => {
  try {
    // Find all users with role 'retailer' and status 'inactive'
    const pendingRetailers = await User.findAll({
      where: {
        role: 'retailer',
        status: 'inactive'
      },
      attributes: ['user_id', 'name', 'email', 'phone_number', 'profileImage_url', 'status', 'role', 'ban_reason', 'admin_notes', 'createdAt', 'updatedAt']
    });
    
    // Transform data for frontend
    const formattedRetailers = pendingRetailers.map(retailer => ({
      id: retailer.user_id,
      name: retailer.name,
      email: retailer.email,
      phone: retailer.phone_number,
      profileImage_url: retailer.profileImage_url,
      status: retailer.status,
      role: retailer.role,
      ban_reason: retailer.ban_reason,
      admin_notes: retailer.admin_notes,
      createdDate: new Date(retailer.createdAt).toISOString().split('T')[0],
      lastLogin: new Date(retailer.updatedAt).toISOString().split('T')[0]
    }));
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: formattedRetailers,
      count: formattedRetailers.length
    });
  } catch (error) {
    console.error('Error fetching pending retailers:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status, notes } = req.body;
    
    // Convert status to lowercase for case-insensitive comparison
    const statusLowercase = status?.toLowerCase();
    
    // Validate status
    if (!statusLowercase || !['active', 'inactive', 'banned'].includes(statusLowercase)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.custom("Invalid status value"),
      });
    }
    
    // Find the user
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }
    
    // Check if status is already the same
    if (user.status === statusLowercase) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGE.post.sameEntry,
      });
    }
    
    // Update user status with the lowercase value and save notes
    const updateData = { status: statusLowercase };
    
    // Add notes if provided
    if (notes) {
      updateData.admin_notes = notes;
    }
    
    // Add ban_reason if status is banned
    if (statusLowercase === 'banned' && req.body.reason) {
      updateData.ban_reason = req.body.reason;
    }
    
    await user.update(updateData);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      data: { user_id, status: statusLowercase },
    });
  } catch (error) {
    console.error('Error changing user status:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

/**
 * Get all retailers with banned status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBannedRetailers = async (req, res) => {
  try {
    // Find all users with role 'retailer' and status 'banned'
    const bannedRetailers = await User.findAll({
      where: {
        role: 'retailer',
        status: 'banned'
      },
      attributes: ['user_id', 'name', 'email', 'phone_number', 'profileImage_url', 'status', 'role', 'ban_reason', 'admin_notes', 'createdAt', 'updatedAt']
    });
    
    // Transform data for frontend
    const formattedRetailers = bannedRetailers.map(retailer => ({
      id: retailer.user_id,
      name: retailer.name,
      email: retailer.email,
      phone: retailer.phone_number,
      profileImage_url: retailer.profileImage_url,
      status: retailer.status,
      role: retailer.role,
      ban_reason: retailer.ban_reason,
      admin_notes: retailer.admin_notes,
      createdDate: new Date(retailer.createdAt).toISOString().split('T')[0],
      lastLogin: new Date(retailer.updatedAt).toISOString().split('T')[0]
    }));
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: formattedRetailers,
      count: formattedRetailers.length
    });
  } catch (error) {
    console.error('Error fetching banned retailers:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.error,
      error: error.message,
    });
  }
};

const approveRejectBanUserController = {
  approveUser,
  rejectUser,
  banUser,
  changeUserStatus,
  getPendingRetailers,
  getBannedRetailers
};

export default approveRejectBanUserController;