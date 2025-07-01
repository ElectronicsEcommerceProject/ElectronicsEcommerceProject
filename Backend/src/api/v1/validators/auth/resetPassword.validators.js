import Joi from "joi";

// Validator for requesting a password reset (forgot password)
export const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Validator for resetting password with OTP
export const resetPasswordValidator = Joi.object({
  otp: Joi.string().length(4).pattern(/^[0-9]+$/).required().messages({
    "string.length": "OTP must be exactly 4 digits",
    "string.pattern.base": "OTP must contain only numbers",
    "any.required": "OTP is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});
