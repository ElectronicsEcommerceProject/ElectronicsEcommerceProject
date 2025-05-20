import React, { useState } from "react";
import ForgotPassword from "../../admin/AdminLayout/ForgotPassword";
import admin from "../../../assets/admin.jpg"; // ✅ make sure the image file path is correct

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      alert("Please fill in both fields");
      return;
    }

    const submissionData = {
      username: loginData.username,
      password: loginData.password,
    };

    console.log("Submitting:", submissionData);
    alert(`Login attempted with: ${JSON.stringify(submissionData)}`);
  };

  const handleForgotPassword = (email) => {
    console.log("Password reset email:", email);
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 font-sans">
      <div className="flex w-full h-screen bg-white shadow-lg overflow-hidden">
        {/* Login Section */}
        <div className="flex-1 flex justify-center items-center p-8 bg-white">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md bg-white p-10 rounded-xl shadow-md"
          >
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Admin Dashboard
            </h1>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-95 transition-all"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="block text-center text-blue-500 text-sm mt-4 hover:text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div
          className="flex-1 bg-cover bg-center relative hidden md:block"
          style={{ backgroundImage: `url(${admin})` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold text-center z-10 text-shadow">
            Empower Your E-Commerce Business
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPassword
          onClose={() => setShowForgotPassword(false)}
          onSubmit={handleForgotPassword}
        />
      )}
    </div>
  );
};

export default AdminLogin;
