import React, { useState } from "react";
import AdminSidebar from "../../features/admin/Dashboard/AdminSidebar";
import AdminDashboard from "../../features/admin/Dashboard/AdminDashboard";
import { AiOutlineLogout } from "react-icons/ai";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 via-blue-500 to-blue-700 p-2 sm:p-4 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md mb-2 sm:mb-0">
          Maa Lakshmi
        </div>
        <div className="text-xl sm:text-2xl font-semibold text-white drop-shadow-md mb-2 sm:mb-0">
          Dashboard
        </div>
        <div className="flex flex-col items-center sm:items-end space-y-2">
          <button className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105 duration-300 shadow-md flex items-center space-x-1">
            <AiOutlineLogout className="text-lg sm:text-xl" />
            <span className="text-sm sm:text-base md:inline">Logout</span>
          </button>
          <p className="text-base sm:text-lg font-medium text-white drop-shadow-md">
            Welcome, Rohit Kumar
          </p>
        </div>
      </header>

      {/* Main Layout with Sidebar and Dashboard (with gap from header) */}
      <div className="flex mt-4 sm:mt-6 lg:mt-8">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md hidden sm:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-0 sm:pt-0 lg:pt-0 px-2 sm:px-4 lg:px-6">
          <div className="w-full border-2 border-yellow-400 bg-gradient-to-r from-yellow-400 via-yellow-300 to-transparent rounded-xl p-4 sm:p-6 lg:p-8">
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
