import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { getApi, adminReportsAnalyticsDashboardDataRoute } from "../../../src/index.js";

// Dashboard Component
const Dashboard = ({ dateRange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart refs
  const gaugeRef = useRef(null);
  const ordersChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const brandDistributionChartRef = useRef(null);
  const brandRevenueChartRef = useRef(null);
  const salesByCategoryChartRef = useRef(null);
  const categoryDistributionChartRef = useRef(null);
  const performanceComparisonChartRef = useRef(null);

  // Helper function to build query parameters based on dateRange
  const buildQueryParams = (dateRange) => {
    const params = new URLSearchParams();

    if (typeof dateRange === "string") {
      const periodMap = {
        Today: "day",
        Week: "week",
        Month: "month",
      };
      params.append("period", periodMap[dateRange] || "month");
    } else if (dateRange && dateRange.start && dateRange.end) {
      params.append("period", "custom");
      params.append("startDate", dateRange.start);
      params.append("endDate", dateRange.end);
    } else {
      params.append("period", "month");
    }

    return params.toString();
  };

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = buildQueryParams(dateRange);
        const apiUrl = adminReportsAnalyticsDashboardDataRoute + `?${queryParams}`;
        console.log("API URL with params:", apiUrl);

        const response = await getApi(apiUrl);
        console.log("Dashboard API Response:", response);

        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error fetching dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]);

  // Helper function to get period label
  const getPeriodLabel = (period) => {
    if (typeof period === "string") {
      return `(${period})`;
    }
    return "(Custom Range)";
  };

  useEffect(() => {
    if (!dashboardData || isLoading) return;

    // Destroy existing charts if they exist
    if (revenueChartRef.current) revenueChartRef.current.destroy();
    if (ordersChartRef.current) ordersChartRef.current.destroy();
    if (brandDistributionChartRef.current)
      brandDistributionChartRef.current.destroy();
    if (brandRevenueChartRef.current)
      brandRevenueChartRef.current.destroy();
    if (salesByCategoryChartRef.current)
      salesByCategoryChartRef.current.destroy();
    if (categoryDistributionChartRef.current)
      categoryDistributionChartRef.current.destroy();
    if (performanceComparisonChartRef.current)
      performanceComparisonChartRef.current.destroy();

    // 1. Revenue Over Time Chart (Line Chart)
    const ctxRevenue = document
      .getElementById("dashboardRevenueChart")
      ?.getContext("2d");
    if (ctxRevenue && dashboardData.revenueOverTime && Array.isArray(dashboardData.revenueOverTime)) {
      const revenueData = dashboardData.revenueOverTime;
      revenueChartRef.current = new Chart(ctxRevenue, {
        type: "line",
        data: {
          labels: revenueData.map((d) => new Date(d.date).toLocaleDateString()),
          datasets: [
            {
              label: "Revenue",
              data: revenueData.map((d) => d.revenue),
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
            y: { beginAtZero: true, title: { display: true, text: "Revenue (₹)" } },
            x: { title: { display: true, text: "Date" } },
          },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Revenue Over Time (By Revenue) ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 2. Sales by Category Chart
    const ctxSalesByCategory = document
      .getElementById("dashboardSalesByCategoryChart")
      ?.getContext("2d");
    if (ctxSalesByCategory && dashboardData.categoryDistribution && Array.isArray(dashboardData.categoryDistribution)) {
      const categoryData = dashboardData.categoryDistribution;
      const labels = categoryData.map((item) => item.category || item.name);
      const data = categoryData.map((item) => item.count || item.value || 0);

      salesByCategoryChartRef.current = new Chart(ctxSalesByCategory, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Sales by Category",
              data: data,
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#F97316",
                "#06B6D4",
                "#84CC16",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Count" } },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Sales by Category (By Orders) ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 3. Brand Distribution Chart
    const ctxBrandDistribution = document
      .getElementById("dashboardBrandDistributionChart")
      ?.getContext("2d");
    if (ctxBrandDistribution && dashboardData.brandDistribution && Array.isArray(dashboardData.brandDistribution)) {
      const brandData = dashboardData.brandDistribution;
      const labels = brandData.map((item) => item.brand || item.name);
      const data = brandData.map((item) => item.count || item.value || 0);

      brandDistributionChartRef.current = new Chart(ctxBrandDistribution, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Brand Distribution",
              data: data,
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#F97316",
                "#06B6D4",
                "#84CC16",
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
              text: `Brand Distribution (By Orders) ${getPeriodLabel(dateRange)}`,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // 4. Sales by Brand (Revenue) Chart
    const ctxBrandRevenue = document
      .getElementById("dashboardBrandRevenueChart")
      ?.getContext("2d");
    if (ctxBrandRevenue && dashboardData.brandDistribution && Array.isArray(dashboardData.brandDistribution)) {
      const brandData = dashboardData.brandDistribution;
      const labels = brandData.map((item) => item.brand || item.name);
      const data = brandData.map((item) => {
        const avgOrderValue = dashboardData.salesOverview?.averageOrderValue || 100;
        return (item.count || item.value || 0) * avgOrderValue;
      });

      brandRevenueChartRef.current = new Chart(ctxBrandRevenue, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Revenue by Brand",
              data: data,
              backgroundColor: [
                "#10B981",
                "#3B82F6",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#F97316",
                "#06B6D4",
                "#84CC16",
              ],
              borderColor: [
                "#059669",
                "#2563EB",
                "#D97706",
                "#DC2626",
                "#7C3AED",
                "#EA580C",
                "#0891B2",
                "#65A30D",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Revenue (₹)" } },
            x: { title: { display: true, text: "Brand" } },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Sales by Brand (By Revenue) ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 5. Performance Comparison Chart
    const ctxPerformanceComparison = document
      .getElementById("dashboardPerformanceComparisonChart")
      ?.getContext("2d");
    if (ctxPerformanceComparison && dashboardData.salesOverview) {
      const currentRevenue = dashboardData.salesOverview.totalRevenue || 0;
      const currentOrders = dashboardData.salesOverview.totalOrders || 0;
      const previousRevenue = dashboardData.salesOverview.previousRevenue || 0;
      const previousOrders = dashboardData.salesOverview.previousOrders || 0;

      const currentPeriodLabel = typeof dateRange === "string" ? 
        (dateRange === "Today" ? "Today" : 
         dateRange === "Week" ? "This Week" : 
         dateRange === "Month" ? "This Month" : "Current Period") : 
        "Current Period";
      const previousPeriodLabel = typeof dateRange === "string" ? 
        (dateRange === "Today" ? "Yesterday" : 
         dateRange === "Week" ? "Last Week" : 
         dateRange === "Month" ? "Last Month" : "Previous Period") : 
        "Previous Period";

      performanceComparisonChartRef.current = new Chart(ctxPerformanceComparison, {
        type: "bar",
        data: {
          labels: ["Revenue", "Orders"],
          datasets: [
            {
              label: currentPeriodLabel,
              data: [currentRevenue, currentOrders],
              backgroundColor: "#3B82F6",
              borderColor: "#2563EB",
              borderWidth: 1,
            },
            {
              label: previousPeriodLabel,
              data: [previousRevenue, previousOrders],
              backgroundColor: "#9CA3AF",
              borderColor: "#6B7280",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Value" } },
          },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Performance Comparison (Revenue vs Orders) ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // Orders by Status Chart
    const ctxOrders = document
      .getElementById("dashboardOrdersByStatusChart")
      ?.getContext("2d");
    if (ctxOrders && dashboardData.orderStatusDistribution && Array.isArray(dashboardData.orderStatusDistribution)) {
      const ordersData = dashboardData.orderStatusDistribution;
      const labels = ordersData.map((item) => item.status);
      const data = ordersData.map((item) => item.count);

      ordersChartRef.current = new Chart(ctxOrders, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#9966FF", "#FF9F40"],
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
            title: {
              display: true,
              text: `Orders by Status (By Orders) ${getPeriodLabel(dateRange)}`,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Category Distribution Chart
    const ctxCategoryDistribution = document
      .getElementById("dashboardCategoryDistributionChart")
      ?.getContext("2d");
    if (ctxCategoryDistribution && dashboardData.categoryDistribution && Array.isArray(dashboardData.categoryDistribution)) {
      const categoryData = dashboardData.categoryDistribution;
      const labels = categoryData.map((item) => item.category || item.name);
      const data = categoryData.map((item) => item.count || item.value || 0);

      categoryDistributionChartRef.current = new Chart(ctxCategoryDistribution, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Category Distribution",
              data: data,
              backgroundColor: [
                "#10B981",
                "#3B82F6",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#F97316",
                "#06B6D4",
                "#84CC16",
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
              text: `Category Distribution (By Orders) ${getPeriodLabel(dateRange)}`,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Customer Satisfaction Gauge
    const canvas = gaugeRef.current;
    if (canvas && dashboardData.customerSatisfaction !== undefined) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height;
      const radius = width / 2 - 10;
      const startAngle = Math.PI;
      const endAngle = 2 * Math.PI;
      const value = (dashboardData.customerSatisfaction / 5) * 100;
      const target = 75;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + Math.PI / 2, false);
      ctx.lineWidth = 20;
      ctx.strokeStyle = "#FF6B6B";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle + Math.PI / 2, startAngle + (3 * Math.PI) / 4, false);
      ctx.strokeStyle = "#FFD700";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle + (3 * Math.PI) / 4, endAngle, false);
      ctx.strokeStyle = "#90EE90";
      ctx.stroke();

      const needleAngle = startAngle + (value / 100) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(needleAngle), centerY + radius * Math.sin(needleAngle));
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
      ctx.fillText("75%", centerX + radius * Math.cos(startAngle + (3 * Math.PI) / 4) + 20, centerY + radius * Math.sin(startAngle + (3 * Math.PI) / 4) + 5);
      ctx.fillText("100%", centerX + radius + 20, centerY + 10);
      ctx.font = "20px Arial";
      ctx.fillText(`${value}%`, centerX - 20, centerY - 20);
    }

    return () => {
      if (revenueChartRef.current) revenueChartRef.current.destroy();
      if (ordersChartRef.current) ordersChartRef.current.destroy();
      if (brandDistributionChartRef.current)
        brandDistributionChartRef.current.destroy();
      if (brandRevenueChartRef.current)
        brandRevenueChartRef.current.destroy();
      if (salesByCategoryChartRef.current)
        salesByCategoryChartRef.current.destroy();
      if (categoryDistributionChartRef.current)
        categoryDistributionChartRef.current.destroy();
      if (performanceComparisonChartRef.current)
        performanceComparisonChartRef.current.destroy();
    };
  }, [dateRange, dashboardData, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Show message if no data
  if (!dashboardData) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg">No dashboard data available</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Total Revenue {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
            ₹{dashboardData.salesOverview?.totalRevenue?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Total Orders {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
            {dashboardData.salesOverview?.totalOrders?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Total Customers {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
            {dashboardData.salesOverview?.totalCustomers?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Average Order Value {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
            ₹{typeof dashboardData.salesOverview?.averageOrderValue === 'number' ? dashboardData.salesOverview.averageOrderValue.toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Additional Summary Cards */}
      <div className="mt-3 sm:mt-4 lg:mt-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Customer Satisfaction
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
            {typeof dashboardData.customerSatisfaction === 'number' ? dashboardData.customerSatisfaction.toFixed(1) : '0.0'}/5.0
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Total Retailers {getPeriodLabel(dateRange)}
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">
            {dashboardData.salesOverview?.totalRetailers || '0'}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Stock Alerts
          </h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
            {dashboardData.stockAlerts?.length || 0}
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 lg:mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Revenue Over Time (By Revenue) {getPeriodLabel(dateRange)}
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
            Orders by Status (By Orders) {getPeriodLabel(dateRange)}
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
            Category Distribution (By Orders) {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardCategoryDistributionChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Brand Distribution (By Orders) {getPeriodLabel(dateRange)}
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
            Sales by Brand (By Revenue) {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardBrandRevenueChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Performance Comparison (Revenue vs Orders) {getPeriodLabel(dateRange)}
          </h3>
          <div className="chart-container h-48 sm:h-64 lg:h-72">
            <canvas
              id="dashboardPerformanceComparisonChart"
              className="w-full h-full max-w-full"
            ></canvas>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 lg:mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
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

      <div className="mt-3 sm:mt-4 lg:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow w-full overflow-x-hidden">
        <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
          Sales by Category (By Orders) {getPeriodLabel(dateRange)}
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