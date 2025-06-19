import React, { useState } from "react";

const ForgotPassword = ({ setModalContent, setMessage }) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
    setErrors((prev) => ({ ...prev, forgotPasswordEmail: "" }));
    setMessage("");
  };

  const handleForgotPasswordSubmit = (e) => {
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

    // Simulate API call
    setTimeout(() => {
      setMessage("Password reset link sent to your email!");
      setForgotPasswordEmail("");
      setIsLoading(false);
      setTimeout(() => setModalContent(null), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Forgot Password
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Enter your email to receive a password reset link.
      </p>
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
