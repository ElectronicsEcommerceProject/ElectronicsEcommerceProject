import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

export const profileValidator = Joi.object({
  name: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": MESSAGE.custom("Name is required"),
      "any.required": MESSAGE.custom("Name is required"),
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": MESSAGE.custom("Invalid email format"),
      "any.required": MESSAGE.custom("Email is required"),
    }),

  profileImage_url: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": MESSAGE.custom("Profile image URL must be a valid URI"),
    }),
});
