import React, { useState } from "react";
import TopNav from "./shared/TopNav.jsx";
import Filters from "./shared/Filters.jsx";
import Dashboard from "./Dashboard.AnalyticsDashboard.jsx";
import Products from "./Products.AnalyticsDashboard.jsx";
import Orders from "./Orders.AnalyticsDashboard.jsx";
import Users from "./Users.AnalyticsDashboard.jsx";
import Reviews from "./Reviews.AnalyticsDashboard.jsx";
import Coupons from "./Coupons.AnalyticsDashboard.jsx";
import { injectGlobalStyles } from "./shared/analyticsUtils.js";

// Inject global styles
injectGlobalStyles();

const AnalyticDashboard = () => {
  // Main App State
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dateRange, setDateRange] = useState("Month");

  return (
    <div className="bg-gray-100 min-h-screen overflow-x-hidden">
      <TopNav
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {activeSection === "dashboard" && (
          <>
            <Filters onDateChange={setDateRange} />
            <Dashboard dateRange={dateRange} />
          </>
        )}
        {activeSection === "products" && (
          <>
            <Filters onDateChange={setDateRange} />
            <Products dateRange={dateRange} />
          </>
        )}
        {activeSection === "orders" && (
          <>
            <Filters onDateChange={setDateRange} />
            <Orders dateRange={dateRange} />
          </>
        )}
        {activeSection === "users" && (
          <>
            <Filters onDateChange={setDateRange} />
            <Users dateRange={dateRange} />
          </>
        )}
        {activeSection === "reviews" && (
          <>
            <Filters onDateChange={setDateRange} />
            <Reviews dateRange={dateRange} />
          </>
        )}
        {activeSection === "coupons" && (
          <>
            <Filters onDateChange={setDateRange} />
            <Coupons dateRange={dateRange} />
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticDashboard;