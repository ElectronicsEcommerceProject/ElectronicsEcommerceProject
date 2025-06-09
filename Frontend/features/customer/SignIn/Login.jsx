import React, { useState } from "react";
import { FaFacebookF, FaEye, FaEyeSlash, } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';


const Login = ({ setModalContent, setUser, closeModal, setMessage }) => {
  const [loginData, setLoginData] = useState({ emailOrMobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};
    if (!loginData.emailOrMobile) {
      newErrors.emailOrMobile = "Please enter your email or mobile number";
    }
    if (!loginData.password) {
      newErrors.password = "Please enter your password";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setUser({ emailOrMobile: loginData.emailOrMobile });
      setModalContent("success");
      setMessage("Login successful!");
      setLoginData({ emailOrMobile: "", password: "" });
      setIsLoading(false);
    }, 1000);
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
            Email or Mobile
          </label>
          <input
            type="text"
            name="emailOrMobile"
            value={loginData.emailOrMobile}
            onChange={handleLoginChange}
            placeholder="Enter email or mobile"
            autoFocus
            autoComplete="email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
            aria-label="Email or Mobile"
          />
          {errors.emailOrMobile && (
            <p className="text-red-500 text-xs mt-1">{errors.emailOrMobile}</p>
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
              {showLoginPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
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
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="space-y-2">
        <button
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Login with Google"
          onClick={() => {
            setMessage("Google login initiated (dummy)");
            setTimeout(() => setMessage(""), 2000);
          }}
        >
          <FcGoogle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-gray-800">Login with Google</span>
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          aria-label="Login with Facebook"
          onClick={() => {
            setMessage("Facebook login initiated (dummy)");
            setTimeout(() => setMessage(""), 2000);
          }}
        >
          <FaFacebookF className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">Login with Facebook</span>
        </button>
      </div>
      <div className="text-center">
        <button
          className="text-blue-600 text-sm underline hover:text-blue-800"
          onClick={closeModal}
          aria-label="Close login modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;