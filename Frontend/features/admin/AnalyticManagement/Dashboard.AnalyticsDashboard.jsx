import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import { dashboardData } from "./shared/analyticsData.js";

// Dashboard Component
const Dashboard = ({ dateRange }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Chart refs
  const gaugeRef = useRef(null);
  const ordersChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const brandDistributionChartRef = useRef(null);
  const userGrowthChartRef = useRef(null);
  const salesByCategoryChartRef = useRef(null);

  // Helper function to get data based on dropdown selection
  const getDataByPeriod = (dataObj, period) => {
    // For total revenue, always return the full object
    if (dataObj === dashboardData.totalRevenue) {
      return dataObj;
    }

    if (typeof period === "string") {
      const key = period.toLowerCase();
      return dataObj[key] || dataObj.month || dataObj;
    }
    // For custom range, use month data
    return dataObj.month || dataObj;
  };

  // Helper function to get period label
  const getPeriodLabel = (period) => {
    if (typeof period === "string") {
      return `(${period})`;
    }
    return "(Custom Range)";
  };

  useEffect(() => {
    // Destroy existing charts if they exist
    if (revenueChartRef.current) revenueChartRef.current.destroy();
    if (ordersChartRef.current) ordersChartRef.current.destroy();
    if (comparisonChartRef.current) comparisonChartRef.current.destroy();
    if (brandDistributionChartRef.current)
      brandDistributionChartRef.current.destroy();
    if (userGrowthChartRef.current) userGrowthChartRef.current.destroy();
    if (salesByCategoryChartRef.current)
      salesByCategoryChartRef.current.destroy();

    // 1. Revenue Over Time Chart (Line Chart)
    const ctxRevenue = document
      .getElementById("dashboardRevenueChart")
      ?.getContext("2d");
    if (ctxRevenue) {
      revenueChartRef.current = new Chart(ctxRevenue, {
        type: "line",
        data: {
          labels: getDataByPeriod(dashboardData.revenueOverTime, dateRange).map(
            (d) => d.period
          ),
          datasets: [
            {
              label: "Revenue",
              data: getDataByPeriod(
                dashboardData.revenueOverTime,
                dateRange
              ).map((d) => d.revenue),
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#3B82F6",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Revenue ($)" },
            },
            x: {
              title: { display: true, text: "Time Period" },
            },
          },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Revenue Over Time ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 2. Sales by Category Chart
    const ctxSalesByCategory = document
      .getElementById("dashboardSalesByCategoryChart")
      ?.getContext("2d");
    if (ctxSalesByCategory) {
      const categoryData = getDataByPeriod(
        dashboardData.salesByCategory,
        dateRange
      );
      salesByCategoryChartRef.current = new Chart(ctxSalesByCategory, {
        type: "bar",
        data: {
          labels: Object.keys(categoryData),
          datasets: [
            {
              label: "Sales by Brand",
              data: Object.values(categoryData),
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Sales ($)" },
            },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Sales by Brand ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 3. Brand Distribution Chart
    const ctxBrandDistribution = document
      .getElementById("dashboardBrandDistributionChart")
      ?.getContext("2d");
    if (ctxBrandDistribution) {
      const brandData = getDataByPeriod(
        dashboardData.brandDistribution,
        dateRange
      );
      brandDistributionChartRef.current = new Chart(ctxBrandDistribution, {
        type: "pie",
        data: {
          labels: Object.keys(brandData),
          datasets: [
            {
              label: "Brand Distribution",
              data: Object.values(brandData),
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "right" },
            title: {
              display: true,
              text: `Brand Distribution ${getPeriodLabel(dateRange)}`,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // 4. User Growth Chart
    const ctxUserGrowth = document
      .getElementById("dashboardUserGrowthChart")
      ?.getContext("2d");
    if (ctxUserGrowth) {
      const userGrowthData = getDataByPeriod(
        dashboardData.userGrowth,
        dateRange
      );
      userGrowthChartRef.current = new Chart(ctxUserGrowth, {
        type: "line",
        data: {
          labels: userGrowthData.map((d) => d.period),
          datasets: [
            {
              label: "New Users",
              data: userGrowthData.map((d) => d.newUsers),
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.2,
              fill: true,
            },
            {
              label: "Active Users",
              data: userGrowthData.map((d) => d.activeUsers),
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.2,
              fill: true,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `User Growth Trend ${getPeriodLabel(dateRange)}`,
            },
          },
          scales: {
            y: { beginAtZero: true },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Orders by Status Chart - Existing implementation
    const ctxOrders = document
      .getElementById("dashboardOrdersByStatusChart")
      ?.getContext("2d");
    if (ctxOrders) {
      const ordersData = getDataByPeriod(
        dashboardData.ordersByStatus,
        dateRange
      );
      ordersChartRef.current = new Chart(ctxOrders, {
        type: "doughnut",
        data: {
          labels: Object.keys(ordersData),
          datasets: [
            {
              data: Object.values(ordersData),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40"],
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
            title: {
              display: true,
              text: `Orders by Status ${getPeriodLabel(dateRange)}`,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // This Month vs Last Month Chart - Existing implementation
    const ctxComparison = document
      .getElementById("dashboardComparisonChart")
      ?.getContext("2d");
    if (ctxComparison) {
      let comparisonData;
      let chartTitle = "Performance Comparison";

      if (typeof dateRange === "string") {
        if (dateRange === "Today") {
          comparisonData = dashboardData.thisDayVsYesterday;
          chartTitle = "Today vs Yesterday";
        } else if (dateRange === "Week") {
          comparisonData = dashboardData.thisWeekVsLast;
          chartTitle = "This Week vs Last Week";
        } else if (dateRange === "Month") {
          comparisonData = dashboardData.thisMonthVsLast;
          chartTitle = "This Month vs Last Month";
        } else {
          comparisonData = dashboardData.thisMonthVsLast;
          chartTitle = "This Month vs Last Month";
        }
      } else {
        comparisonData = dashboardData.thisMonthVsLast;
        chartTitle = "Custom Range Comparison";
      }

      comparisonChartRef.current = new Chart(ctxComparison, {
        type: "bar",
        data: {
          labels: ["Revenue", "Orders"],
          datasets: [
            {
              label: "Current Period",
              data: [
                comparisonData.thisPeriodRevenue ||
                  comparisonData.thisMonthRevenue,
                comparisonData.thisPeriodOrders ||
                  comparisonData.thisMonthOrders,
              ],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Previous Period",
              data: [
                comparisonData.lastPeriodRevenue ||
                  comparisonData.lastMonthRevenue,
                comparisonData.lastPeriodOrders ||
                  comparisonData.lastMonthOrders,
              ],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: chartTitle,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Customer Satisfaction Gauge
    const canvas = gaugeRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height;
      const radius = width / 2 - 10;
      const startAngle = Math.PI;
      const endAngle = 2 * Math.PI;
      const value = getDataByPeriod(
        dashboardData.customerSatisfaction,
        dateRange
      );
      const target = 75;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle,
        startAngle + Math.PI / 2,
        false
      );
      ctx.lineWidth = 20;
      ctx.strokeStyle = "#FF6B6B";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle + Math.PI / 2,
        startAngle + (3 * Math.PI) / 4,
        false
      );
      ctx.strokeStyle = "#FFD700";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle + (3 * Math.PI) / 4,
        endAngle,
        false
      );
      ctx.strokeStyle = "#90EE90";
      ctx.stroke();

      const needleAngle = startAngle + (value / 100) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(needleAngle),
        centerY + radius * Math.sin(needleAngle)
      );
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#000";
      ctx.fill();

      const targetAngle = startAngle + (target / 100) * Math.PI;
      const arrowX = centerX + (radius + 20) * Math.cos(targetAngle);
      const arrowY = centerY + (radius + 20) * Math.sin(targetAngle);
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 10, arrowY - 10);
      ctx.lineTo(arrowX + 10, arrowY - 10);
      ctx.closePath();
      ctx.fillStyle = "#FF0000";
      ctx.fill();
      ctx.fillText("Target", arrowX + 30, arrowY - 5);

      ctx.font = "12px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText("0%", centerX - radius - 20, centerY + 10);
      ctx.fillText("50%", centerX, centerY - radius - 10);
      ctx.fillText(
        "75%",
        centerX + radius * Math.cos(startAngle + (3 * Math.PI) / 4) + 20,
        centerY + radius * Math.sin(startAngle + (3 * Math.PI) / 4) + 5
      );
      ctx.fillText("100%", centerX + radius + 20, centerY + 10);
      ctx.font = "20px Arial";
      ctx.fillText(`${value}%`, centerX - 20, centerY - 20);
    }

    return () => {
      // Cleanup all charts
      if (revenueChartRef.current) revenueChartRef.current.destroy();
      if (ordersChartRef.current) ordersChartRef.current.destroy();
      if (comparisonChartRef.current) comparisonChartRef.current.destroy();
      if (brandDistributionChartRef.current)
        brandDistributionChartRef.current.destroy();
      if (userGrowthChartRef.current) userGrowthChartRef.current.destroy();
      if (salesByCategoryChartRef.current)
        salesByCategoryChartRef.current.destroy();
    };
  }, [dateRange]);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Total Revenue {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xs sm:text-sm lg:text-base break-words">
            Daily: ${dashboardData.totalRevenue.daily.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm lg:text-base break-words">
            Weekly: ${dashboardData.totalRevenue.weekly.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm lg:text-base break-words">
            Monthly: ${dashboardData.totalRevenue.monthly.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Total Customers / Retailers {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xs sm:text-sm lg:text-base break-words">
            Customers: {dashboardData.totalCustomers.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm lg:text-base break-words">
            Retailers: {dashboardData.totalRetailers.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Average Order Value {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
            ${getDataByPeriod(dashboardData.averageOrderValue, dateRange)}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Low Stock Alerts
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
            {dashboardData.lowStockAlerts} items
          </p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 lg:mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Revenue Over Time {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardRevenueChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Orders by Status {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardOrdersByStatusChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Brand Distribution {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardBrandDistributionChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            User Growth Trend {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardUserGrowthChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Performance Comparison {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardComparisonChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Customer Satisfaction Score {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-32 sm:h-40 lg:h-48">
            <canvas
              ref={gaugeRef}
              width="400"
              height="200"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
      </div>

      {/* Sales by Brand Chart */}
      <div className="mt-3 sm:mt-4 lg:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow w-full overflow-x-hidden">
        <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
          Sales by Brand {getPeriodLabel(dateRange)}
        </h3>
        <div className="chart-container h-48 sm:h-64 lg:h-72">
          <canvas
            id="dashboardSalesByCategoryChart"
            className="w-full h-full max-w-full"
          ></canvas>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {selectedItem.name} Details
            </h2>
            <p className="text-sm sm:text-base">{selectedItem.details}</p>
            <button
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto"
              onClick={() => setSelectedItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
