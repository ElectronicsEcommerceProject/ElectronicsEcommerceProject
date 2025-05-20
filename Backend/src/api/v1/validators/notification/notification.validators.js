import Joi from "joi";
import MESSAGE from "../../../../constants/message.js";

// Validator for user ID
export const userIdValidators = Joi.object({
  user_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("User ID is required"),
    }),
});

// Validator for notification ID
export const notificationIdValidator = Joi.object({
  notification_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": MESSAGE.custom("Notification ID must be a valid UUID"),
      "any.required": MESSAGE.custom("Notification ID is required"),
    }),
});

// Validator for creating a notification
export const createNotificationValidator = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Title is required"),
      "any.required": MESSAGE.custom("Title is required"),
    }),
  message: Joi.string()
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Message is required"),
      "any.required": MESSAGE.custom("Message is required"),
    }),
  type: Joi.string()
    .valid("info", "warning", "error", "success")
    .optional()
    .messages({
      "any.only": MESSAGE.custom("Invalid notification type"),
    }),
  channel: Joi.string()
    .valid("email", "sms", "in_app", "push")
    .optional()
    .messages({
      "any.only": MESSAGE.custom("Invalid notification channel"),
    }),
  audience: Joi.string()
    .valid("all", "retailer", "customer", "specific")
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Audience type is required"),
      "any.only": MESSAGE.custom("Invalid audience type"),
      "any.required": MESSAGE.custom("Audience type is required"),
    }),
  user_id: Joi.string()
    .uuid()
    .when("audience", {
      is: "specific",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.guid": MESSAGE.custom("User ID must be a valid UUID"),
      "any.required": MESSAGE.custom("User ID is required for specific audience"),
    }),
});

// Validator for updating a notification
export const updateNotificationValidator = Joi.object({
  title: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Title cannot be empty if provided"),
    }),
  message: Joi.string()
    .optional()
    .messages({
      "string.empty": MESSAGE.custom("Message cannot be empty if provided"),
    }),
  type: Joi.string()
    .valid("info", "warning", "error", "success")
    .optional()
    .messages({
      "any.only": MESSAGE.custom("Invalid notification type"),
    }),
  channel: Joi.string()
    .valid("email", "sms", "in_app", "push")
    .optional()
    .messages({
      "any.only": MESSAGE.custom("Invalid notification channel"),
    }),
  is_read: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": MESSAGE.custom("Is read must be a boolean value"),
    }),
});