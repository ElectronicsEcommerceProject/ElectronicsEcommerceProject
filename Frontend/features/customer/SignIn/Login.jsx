import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { ForgotPassword } from "../../index.js";

import { createApi, userPanelLoginRoute } from "../../../src/index.js";

const Login = ({ setModalContent, setUser, setMessage }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    console.log(`Login input change: ${name}=${value}`); // Debug state update
    setLoginData((prev) => {
      const newState = { ...prev, [name]: value };
      console.log("New loginData:", newState); // Debug new state
      return newState;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!loginData.email) {
      newErrors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!loginData.password) {
      newErrors.password = "Please enter your password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data for API call
      const apiData = {
        email: loginData.email,
        password: loginData.password,
      };

      console.warn("Login data:", apiData);

      // Make API call
      const response = await createApi(userPanelLoginRoute, apiData);

      console.log("Login successful:", response);

      // Handle successful login
      if (response.success && response.token) {
        // Store the token in localStorage
        localStorage.setItem("token", response.token);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("tokenChanged"));

        // Decode token to get user information (optional, for immediate use)
        try {
          const tokenPayload = JSON.parse(atob(response.token.split(".")[1]));

          // Create user object from token data
          setUser({
            email: tokenPayload.email || loginData.email,
            emailOrMobile: tokenPayload.email || loginData.email,
            user_id: tokenPayload.user_id,
            role: tokenPayload.role,
            // Add other user properties from token
          });
        } catch (tokenError) {
          console.warn("Could not decode token:", tokenError);
          // Fallback to basic user object
          setUser({
            email: loginData.email,
            emailOrMobile: loginData.email,
          });
        }

        setModalContent("success");
        setMessage("Login successful!");
        setLoginData({ email: "", password: "" });

        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (response.requiresApproval) {
        // Handle retailer account pending approval
        setErrors({
          approvalMessage: response.message,
          adminEmail: response.adminContact?.email,
          adminPhone: response.adminContact?.phone
        });
      } else if (response.isBanned) {
        // Handle banned account
        setErrors({
          bannedMessage: response.message,
          adminEmail: response.adminContact?.email,
          adminPhone: response.adminContact?.phone
        });
      } else {
        setErrors({
          general: response.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle API errors
      if (error.message) {
        if (
          error.message.includes("email") ||
          error.message.includes("not found")
        ) {
          setErrors({
            email: "Email not found. Please check your email or sign up.",
          });
        } else if (error.message.includes("password")) {
          setErrors({ password: "Invalid password. Please try again." });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal function
  const handleCloseModal = () => {
    setModalContent(null);
    setLoginData({ email: "", password: "" });
    setErrors({});
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>
      <div className="flex justify-end">
        <button
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          onClick={() => setModalContent("signup")}
          aria-label="Switch to signup"
        >
          Create an Account
        </button>
      </div>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            placeholder="Enter your email"
            autoFocus
            autoComplete="email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
            aria-label="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showLoginPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
              aria-label="Password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              aria-label={showLoginPassword ? "Hide password" : "Show password"}
            >
              {showLoginPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            onClick={() => setModalContent("forgotPassword")}
            aria-label="Forgot password"
          >
            Forgot Password?
          </button>
        </div>
        {errors.general && !errors.approvalMessage && !errors.bannedMessage && (
          <div className="text-red-500 text-sm text-center">
            {errors.general}
          </div>
        )}
        
        {/* Retailer Approval Message */}
        {errors.approvalMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-yellow-800">Retailer Account Pending Approval</span>
            </div>
            <p className="text-yellow-700 mb-3">{errors.approvalMessage}</p>
            
            <div className="bg-white p-3 rounded border border-yellow-100">
              <p className="text-gray-700 font-medium mb-2">For faster approval, contact our admin:</p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${errors.adminEmail}`} className="text-blue-600 hover:underline">{errors.adminEmail}</a>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${errors.adminPhone}`} className="text-green-600 hover:underline">{errors.adminPhone}</a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Banned Account Message */}
        {errors.bannedMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-red-800">Account Banned</span>
            </div>
            <p className="text-red-700 mb-3">{errors.bannedMessage}</p>
            
            <div className="bg-white p-3 rounded border border-red-100">
              <p className="text-gray-700 font-medium mb-2">For assistance, contact our admin:</p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${errors.adminEmail}`} className="text-blue-600 hover:underline">{errors.adminEmail}</a>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${errors.adminPhone}`} className="text-green-600 hover:underline">{errors.adminPhone}</a>
                </div>
              </div>
            </div>
          </div>
        )}
        {!errors.approvalMessage && !errors.bannedMessage ? (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            aria-label="Submit login"
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
              "Login"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2.5 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
          >
            Close
          </button>
        )}
      </form>
      <div className="text-center">
        <button
          className="text-blue-600 text-sm underline hover:text-blue-800"
          onClick={handleCloseModal}
          aria-label="Close login modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;
