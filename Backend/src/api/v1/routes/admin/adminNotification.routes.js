import express from "express";
import {
  getNotificationLogs,
  getNotificationStats,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  addNotification,
  getInAppNotificationByUserId,
  markAsRead,
  getInAppTotalNumberOfUnReadNotificationByUserId,
} from "../../controllers/admin/adminNotification.controller.js";
import {
  verifyJwtToken,
  validator,
  isAdmin,
} from "../../../../middleware/index.js";
const router = express.Router();

// Notification Management Routes

/**
 * @route   POST /api/v1/admin/notifications/add-Notification
 * @desc    Send notification to target audience
 * @access  Admin only
 * @body    {
 *   targetAudience: string,
 *   channel: string,
 *   templateId?: string,
 *   title: string,
 *   message: string,
 *   specificUserIds?: string[]
 * }
 */
router.post("/add-Notification", verifyJwtToken, isAdmin, addNotification);

/**
 * @route   GET /api/v1/admin/notifications/logs
 * @desc    Get notification logs with filtering and pagination
 * @access  Admin only
 * @query   {
 *   channel?: string,
 *   status?: string,
 *   audience?: string,
 *   page?: number,
 *   limit?: number,
 *   startDate?: string,
 *   endDate?: string
 * }
 */
router.get("/logs", verifyJwtToken, isAdmin, getNotificationLogs);

/**
 * @route   GET /api/v1/admin/notifications/:user_id
 * @desc    Get in-app notifications for a specific user
 * @access  User
 * @params  user_id: string
 */
router.get("/:user_id", verifyJwtToken, getInAppNotificationByUserId);

router.get(
  "/total-Number-Of-Un-Read-Notifications/:user_id",
  verifyJwtToken,
  getInAppTotalNumberOfUnReadNotificationByUserId
);

/**
 * @route   PATCH /api/v1/admin/notifications/:notification_id/mark-as-read
 * @desc    Mark a notification as read
 * @access  User
 * @params  notification_id: string
 */
router.patch("/:notification_id", verifyJwtToken, markAsRead);

/**
 * @route   GET /api/v1/admin/notifications/stats
 * @desc    Get notification statistics
 * @access  Admin only
 * @query   {
 *   channel?: string,
 *   audience?: string,
 *   startDate?: string,
 *   endDate?: string
 * }
 */
router.get("/stats", verifyJwtToken, isAdmin, getNotificationStats);

// Template Management Routes

/**
 * @route   GET /api/v1/admin/notifications/templates
 * @desc    Get all notification templates with pagination
 * @access  Admin only
 * @query   {
 *   page?: number,
 *   limit?: number,
 *   type?: string
 * }
 */
router.get("/templates", verifyJwtToken, isAdmin, getTemplates);

/**
 * @route   POST /api/v1/admin/notifications/templates
 * @desc    Create new notification template
 * @access  Admin only
 * @body    {
 *   name: string,
 *   type: string,
 *   content: string
 * }
 */
router.post("/templates", verifyJwtToken, isAdmin, createTemplate);

/**
 * @route   PATCH /api/v1/admin/notifications/templates/:templateId
 * @desc    Update notification template
 * @access  Admin only
 * @params  templateId: string
 * @body    {
 *   name: string,
 *   type: string,
 *   content: string
 * }
 */
router.patch("/templates/:templateId", verifyJwtToken, isAdmin, updateTemplate);

/**
 * @route   DELETE /api/v1/admin/notifications/templates/:templateId
 * @desc    Delete notification template
 * @access  Admin only
 * @params  templateId: string
 */
router.delete(
  "/templates/:templateId",
  verifyJwtToken,
  isAdmin,
  deleteTemplate
);

export default router;
