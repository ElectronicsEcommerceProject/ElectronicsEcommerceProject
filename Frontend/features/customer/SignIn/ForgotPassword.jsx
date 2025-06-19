import React, { useState } from "react";

import {
  createApi,
  userPanelForgotPasswordRoute,
  resetPasswordRoute,
} from "../../../src/index.js";

const ForgotPassword = ({ setModalContent, setMessage }) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResetFields, setShowResetFields] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
    setErrors((prev) => ({ ...prev, forgotPasswordEmail: "" }));
    setMessage("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};
    if (!forgotPasswordEmail) {
      newErrors.forgotPasswordEmail = "Please enter your email";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await createApi(userPanelForgotPasswordRoute, {
        email: forgotPasswordEmail,
      });
      alert(
        response.message || "Password reset token has been sent to your email"
      );
      if (response.success) {
        setShowResetFields(true);
      }
      setForgotPasswordEmail("");
      setErrors({});
      // Don't close modal here, wait for password reset
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
      setErrors({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};
    if (!resetToken) newErrors.resetToken = "Please enter the token";
    if (!newPassword) newErrors.newPassword = "Please enter a new password";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      const response = await createApi(resetPasswordRoute, {
        token: resetToken,
        password: newPassword,
      });
      if (response.success) {
        alert(response.message || "Password has been reset successfully");
        setShowResetFields(false);
        setResetToken("");
        setNewPassword("");
        setTimeout(() => setModalContent(null), 2000);
      } else {
        alert(response.message || "Failed to reset password");
      }
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Forgot Password
      </h2>
      <p className="text-sm text-gray-600 text-center">
        {showResetFields
          ? "Enter the token sent to your email and your new password."
          : "Enter your email to receive a password reset token."}
      </p>
      {!showResetFields ? (
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={forgotPasswordEmail}
              onChange={handleForgotPasswordChange}
              placeholder="Enter your email"
              autoFocus
              autoComplete="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
              aria-label="Email"
            />
            {errors.forgotPasswordEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.forgotPasswordEmail}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            aria-label="Submit forgot password"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Send Reset Token"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token
            </label>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Enter the token from your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
              aria-label="Token"
            />
            {errors.resetToken && (
              <p className="text-red-500 text-xs mt-1">{errors.resetToken}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
              aria-label="New Password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            aria-label="Submit new password"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
      <div className="text-center">
        <button
          className="text-blue-600 text-sm underline hover:text-blue-800"
          onClick={() => setModalContent("login")}
          aria-label="Back to login"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
