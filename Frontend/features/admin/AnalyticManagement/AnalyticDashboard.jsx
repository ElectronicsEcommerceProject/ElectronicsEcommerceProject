import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Add global styles to prevent horizontal scrolling
const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  canvas {
    max-width: 100% !important;
    height: auto !important;
  }

  .chart-container {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

const AnalyticDashboard = () => {
  // Data
  const timelineData = [
    { month: "Jan 2022", totalSales: 5, productA: 2, productB: 1 },
    { month: "Apr 2022", totalSales: 8, productA: 3, productB: 2 },
    { month: "Jul 2022", totalSales: 12, productA: 5, productB: 3 },
    { month: "Oct 2022", totalSales: 15, productA: 6, productB: 4 },
    { month: "Jan 2023", totalSales: 18, productA: 7, productB: 5 },
    { month: "Apr 2023", totalSales: 22, productA: 9, productB: 6 },
    { month: "Jul 2023", totalSales: 25, productA: 10, productB: 7 },
    { month: "Oct 2023", totalSales: 28, productA: 12, productB: 8 },
    { month: "Jan 2024", totalSales: 32, productA: 14, productB: 9 },
    { month: "Apr 2024", totalSales: 35, productA: 16, productB: 10 },
    { month: "Jul 2024", totalSales: 38, productA: 18, productB: 11 },
    { month: "Oct 2024", totalSales: 42, productA: 20, productB: 12 },
    { month: "Jan 2025", totalSales: 40, productA: 22, productB: 11 },
    { month: "Apr 2025", totalSales: 41, productA: 20, productB: 10 },
  ];

  const dashboardData = {
    totalRevenue: { daily: 5000, weekly: 35000, monthly: 150000 },
    totalOrders: { pending: 50, shipped: 200, delivered: 300, cancelled: 20 },
    totalCustomers: 1200,
    totalRetailers: 150,
    lowStockAlerts: 10,
    topSellingProducts: [
      {
        name: "Product A",
        sales: 300,
        details: "Category: Electronics, Price: $100",
      },
      {
        name: "Product B",
        sales: 250,
        details: "Category: Clothing, Price: $50",
      },
      { name: "Product C", sales: 200, details: "Category: Home, Price: $80" },
      {
        name: "Product D",
        sales: 150,
        details: "Category: Electronics, Price: $120",
      },
      {
        name: "Product E",
        sales: 100,
        details: "Category: Clothing, Price: $40",
      },
    ],
    thisMonthVsLast: {
      thisMonthRevenue: 150000,
      lastMonthRevenue: 140000,
      thisMonthOrders: 570,
      lastMonthOrders: 550,
    },
    customerSatisfaction: 71,
  };

  const productsData = {
    topSelling: [
      {
        name: "Product A",
        sales: 300,
        details: "Category: Electronics, Price: $100",
      },
      {
        name: "Product B",
        sales: 250,
        details: "Category: Clothing, Price: $50",
      },
      { name: "Product C", sales: 200, details: "Category: Home, Price: $80" },
      {
        name: "Product D",
        sales: 150,
        details: "Category: Electronics, Price: $120",
      },
      {
        name: "Product E",
        sales: 100,
        details: "Category: Clothing, Price: $40",
      },
      { name: "Product F", sales: 90, details: "Category: Home, Price: $60" },
      {
        name: "Product G",
        sales: 80,
        details: "Category: Electronics, Price: $110",
      },
      {
        name: "Product H",
        sales: 70,
        details: "Category: Clothing, Price: $45",
      },
      { name: "Product I", sales: 60, details: "Category: Home, Price: $70" },
      {
        name: "Product J",
        sales: 50,
        details: "Category: Electronics, Price: $130",
      },
    ],
    stockSummary: [
      { name: "Product A", stock: 5, status: "Low" },
      { name: "Product B", stock: 0, status: "Out-of-Stock" },
      { name: "Product C", stock: 3, status: "Low" },
      { name: "Product D", stock: 1, status: "Low" },
    ],
    productRatingTrends: [
      { month: "Jan", rating: 4.2 },
      { month: "Feb", rating: 4.3 },
      { month: "Mar", rating: 4.1 },
      { month: "Apr", rating: 4.4 },
      { month: "May", rating: 4.5 },
    ],
  };

  const ordersData = {
    ordersByStatus: [
      { day: "Mon", pending: 10, shipped: 20, delivered: 30, cancelled: 5 },
      { day: "Tue", pending: 15, shipped: 25, delivered: 35, cancelled: 3 },
    ],
    paymentMethods: { cod: 60, prepaid: 40 },
    orderTimeTrends: [
      { hour: "9 AM", orders: 20 },
      { hour: "12 PM", orders: 50 },
      { hour: "3 PM", orders: 30 },
    ],
  };

  const usersData = {
    customers: {
      activeVsInactive: { active: 800, inactive: 400 },
      topCustomers: [
        {
          name: "John Doe",
          purchaseValue: 5000,
          details: "Orders: 15, Last Purchase: 2025-05-01",
        },
        {
          name: "Jane Smith",
          purchaseValue: 4500,
          details: "Orders: 12, Last Purchase: 2025-04-30",
        },
      ],
      purchaseFrequency: [
        { name: "John Doe", frequency: 5 },
        { name: "Jane Smith", frequency: 4 },
      ],
    },
    retailers: {
      salesVolume: [
        {
          name: "Retailer A",
          sales: 2000,
          details: "Products: 50, Active Listings: 45",
        },
        {
          name: "Retailer B",
          sales: 1800,
          details: "Products: 40, Active Listings: 38",
        },
      ],
      activeListings: [
        { name: "Retailer A", listings: 45 },
        { name: "Retailer B", listings: 38 },
      ],
    },
  };

  const reviewsData = {
    ratingDistribution: { 1: 10, 2: 20, 3: 30, 4: 50, 5: 90 },
    reviewVolume: [
      { month: "Jan", volume: 20 },
      { month: "Feb", volume: 25 },
      { month: "Mar", volume: 30 },
    ],
    sentiment: { positive: 70, negative: 30 },
  };

  const couponsData = {
    usageRate: [
      { code: "FLAT50", issued: 100, used: 70 },
      { code: "OFF20", issued: 200, used: 120 },
    ],
    couponTypeEffectiveness: { flat: 40, percentOff: 35, freeShipping: 25 },
    expiredUnused: [
      { code: "EXPIRED1", count: 30 },
      { code: "EXPIRED2", count: 20 },
      { code: "EXPIRED3", count: 15 },
    ],
  };

  // Helper functions
  const filterDataByDateRange = (data, range) => {
    const today = new Date("2025-05-02");
    let startDate, endDate;

    if (typeof range === "string") {
      if (range === "Today") {
        startDate = new Date(today);
        endDate = new Date(today);
      } else if (range === "Week") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
      } else if (range === "Month") {
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        endDate = new Date(today);
      } else {
        return data;
      }
    } else {
      startDate = new Date(range.start);
      endDate = new Date(range.end);
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.month);
      return itemDate >= startDate && itemDate <= endDate;
    });

    return filtered.length > 0 ? filtered : data.slice(-1);
  };

  // Top Navigation Component
  const TopNav = ({ setActiveSection, activeSection }) => (
    <nav className="bg-white shadow sticky top-0 z-10 w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 w-full">
          <div className="flex overflow-x-auto scrollbar-hide w-full">
            <div className="flex space-x-1 sm:space-x-4 lg:space-x-8 min-w-max px-1">
              {[
                "dashboard",
                "products",
                "orders",
                "users",
                "reviews",
                "coupons",
              ].map((section) => (
                <button
                  key={section}
                  className={`inline-flex items-center px-1 sm:px-2 pt-1 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    activeSection === section
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Filters Component
  const Filters = ({ onDateChange }) => {
    const [range, setRange] = useState("Month");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const handleRangeChange = (value) => {
      setRange(value);
      if (value !== "Custom") {
        onDateChange(value);
      }
    };

    const handleCustomApply = () => {
      if (customStart && customEnd) {
        onDateChange({ start: customStart, end: customEnd });
      }
    };

    return (
      <div className="w-full overflow-x-hidden">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 space-y-4 lg:space-y-0 w-full">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
            <select
              className="p-2 border rounded-md text-sm w-full sm:w-auto min-w-0 flex-shrink"
              value={range}
              onChange={(e) => handleRangeChange(e.target.value)}
            >
              <option value="Today">Today</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Custom">Custom</option>
            </select>
            {range === "Custom" && (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <input
                  type="date"
                  className="p-2 border rounded-md text-sm w-full sm:w-auto min-w-0 flex-shrink"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <input
                  type="date"
                  className="p-2 border rounded-md text-sm w-full sm:w-auto min-w-0 flex-shrink"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
                <button
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm whitespace-nowrap flex-shrink-0"
                  onClick={handleCustomApply}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm whitespace-nowrap"
              onClick={() => alert("Exporting as CSV")}
            >
              Export CSV
            </button>
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm whitespace-nowrap"
              onClick={() => alert("Exporting as PDF")}
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Paginated Table Component
  const PaginatedTable = ({
    data,
    headers,
    itemsPerPage,
    onRowClick,
    searchTerm,
    setSearchTerm,
  }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = data.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <div className="w-full overflow-x-hidden">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border rounded-md mb-4 text-sm max-w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Desktop Table View */}
        <div className="hidden md:block max-h-72 overflow-y-auto overflow-x-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer border-b"
                    onClick={() => onRowClick(item)}
                  >
                    {Object.values(item)
                      .slice(0, headers.length)
                      .map((val, i) => (
                        <td
                          key={i}
                          className="p-2 sm:p-3 text-xs sm:text-sm break-words max-w-0"
                        >
                          <div className="truncate">{val}</div>
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 max-h-72 overflow-y-auto w-full">
          {paginatedData.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-3 cursor-pointer hover:bg-gray-50 w-full min-w-0"
              onClick={() => onRowClick(item)}
            >
              {Object.values(item)
                .slice(0, headers.length)
                .map((val, i) => (
                  <div key={i} className="flex justify-between py-1 min-w-0">
                    <span className="font-medium text-gray-600 text-xs flex-shrink-0">
                      {headers[i]}:
                    </span>
                    <span className="text-xs break-words text-right ml-2 min-w-0">
                      {val}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0 w-full">
          <button
            className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-xs sm:text-sm whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = ({ dateRange }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const gaugeRef = useRef(null);
    const ordersChartRef = useRef(null);
    const comparisonChartRef = useRef(null);
    const salesTrendChartRef = useRef(null);

    useEffect(() => {
      const filteredData = filterDataByDateRange(timelineData, dateRange);

      if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
      const ctxSalesTrend = document
        .getElementById("dashboardSalesTrendChart")
        ?.getContext("2d");
      if (ctxSalesTrend) {
        salesTrendChartRef.current = new Chart(ctxSalesTrend, {
          type: "line",
          data: {
            labels: filteredData.map((d) => d.month),
            datasets: [
              {
                label: "Total Sales",
                data: filteredData.map((d) => d.totalSales),
                backgroundColor: "rgba(30, 58, 138, 0.5)",
                borderColor: "#1E3A8A",
                fill: true,
                tension: 0.1,
              },
              {
                label: "Product A Sales",
                data: filteredData.map((d) => d.productA),
                backgroundColor: "rgba(249, 115, 22, 0.5)",
                borderColor: "#F97316",
                fill: true,
                tension: 0.1,
              },
              {
                label: "Product B Sales",
                data: filteredData.map((d) => d.productB),
                backgroundColor: "rgba(20, 184, 166, 0.5)",
                borderColor: "#14B8A6",
                fill: true,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 45,
                title: { display: true, text: "Sales ($)" },
                stacked: true,
              },
              x: { title: { display: true, text: "Timeline" } },
            },
            plugins: { legend: { position: "top" } },
          },
        });
      }

      if (ordersChartRef.current) ordersChartRef.current.destroy();
      const ctxOrders = document
        .getElementById("dashboardOrdersByStatusChart")
        ?.getContext("2d");
      if (ctxOrders) {
        ordersChartRef.current = new Chart(ctxOrders, {
          type: "doughnut",
          data: {
            labels: Object.keys(dashboardData.totalOrders),
            datasets: [
              {
                data: Object.values(dashboardData.totalOrders),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40"],
              },
            ],
          },
        });
      }

      if (comparisonChartRef.current) comparisonChartRef.current.destroy();
      const ctxComparison = document
        .getElementById("dashboardComparisonChart")
        ?.getContext("2d");
      if (ctxComparison) {
        comparisonChartRef.current = new Chart(ctxComparison, {
          type: "bar",
          data: {
            labels: ["Revenue", "Orders"],
            datasets: [
              {
                label: "This Month",
                data: [
                  dashboardData.thisMonthVsLast.thisMonthRevenue,
                  dashboardData.thisMonthVsLast.thisMonthOrders,
                ],
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: "Last Month",
                data: [
                  dashboardData.thisMonthVsLast.lastMonthRevenue,
                  dashboardData.thisMonthVsLast.lastMonthOrders,
                ],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true } } },
        });
      }

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
        const value = dashboardData.customerSatisfaction;
        const target = 75;

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
        if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
        if (ordersChartRef.current) ordersChartRef.current.destroy();
        if (comparisonChartRef.current) comparisonChartRef.current.destroy();
      };
    }, [dateRange]);

    return (
      <div className="w-full overflow-x-hidden">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
              Total Revenue
            </h3>
            <p className="text-xs sm:text-sm lg:text-base break-words">
              Daily: ${dashboardData.totalRevenue.daily}
            </p>
            <p className="text-xs sm:text-sm lg:text-base break-words">
              Weekly: ${dashboardData.totalRevenue.weekly}
            </p>
            <p className="text-xs sm:text-sm lg:text-base break-words">
              Monthly: ${dashboardData.totalRevenue.monthly}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
              Total Customers / Retailers
            </h3>
            <p className="text-xs sm:text-sm lg:text-base break-words">
              Customers: {dashboardData.totalCustomers}
            </p>
            <p className="text-xs sm:text-sm lg:text-base break-words">
              Retailers: {dashboardData.totalRetailers}
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow sm:col-span-2 lg:col-span-1 min-w-0">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
              Low Stock Alerts
            </h3>
            <p className="text-xs sm:text-sm lg:text-base break-words">
              {dashboardData.lowStockAlerts} items
            </p>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 lg:mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 overflow-x-hidden">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Sales Trend
            </h3>
            <div className="chart-container h-48 sm:h-64 lg:h-72">
              <canvas
                id="dashboardSalesTrendChart"
                className="w-full h-full max-w-full"
              ></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
              Orders by Status
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
              This Month vs Last Month
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
              Customer Satisfaction Score
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
        <div className="mt-3 sm:mt-4 lg:mt-6 bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow w-full overflow-x-hidden">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 break-words">
            Top 5 Selling Products
          </h3>
          <div className="w-full overflow-x-hidden">
            <PaginatedTable
              data={dashboardData.topSellingProducts}
              headers={["Name", "Sales"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item)}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
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

  // Products Component
  const Products = ({ dateRange }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const topSellingChartRef = useRef(null);
    const ratingTrendsChartRef = useRef(null);
    const salesTrendChartRef = useRef(null);

    useEffect(() => {
      const filteredData = filterDataByDateRange(timelineData, dateRange);

      if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
      const ctxSalesTrend = document
        .getElementById("productsSalesTrendChart")
        ?.getContext("2d");
      if (ctxSalesTrend) {
        salesTrendChartRef.current = new Chart(ctxSalesTrend, {
          type: "line",
          data: {
            labels: filteredData.map((d) => d.month),
            datasets: [
              {
                label: "Total Sales",
                data: filteredData.map((d) => d.totalSales),
                backgroundColor: "rgba(30, 58, 138, 0.5)",
                borderColor: "#1E3A8A",
                fill: true,
                tension: 0.1,
              },
              {
                label: "Product A Sales",
                data: filteredData.map((d) => d.productA),
                backgroundColor: "rgba(249, 115, 22, 0.5)",
                borderColor: "#F97316",
                fill: true,
                tension: 0.1,
              },
              {
                label: "Product B Sales",
                data: filteredData.map((d) => d.productB),
                backgroundColor: "rgba(20, 184, 166, 0.5)",
                borderColor: "#14B8A6",
                fill: true,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 45,
                title: { display: true, text: "Sales ($)" },
                stacked: true,
              },
              x: { title: { display: true, text: "Timeline" } },
            },
            plugins: { legend: { position: "top" } },
          },
        });
      }

      if (topSellingChartRef.current) topSellingChartRef.current.destroy();
      const ctxTopSelling = document
        .getElementById("productsTopSellingChart")
        ?.getContext("2d");
      if (ctxTopSelling) {
        topSellingChartRef.current = new Chart(ctxTopSelling, {
          type: "bar",
          data: {
            labels: productsData.topSelling.map((p) => p.name),
            datasets: [
              {
                label: "Sales",
                data: productsData.topSelling.map((p) => p.sales),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: { indexAxis: "y", scales: { x: { beginAtZero: true } } },
        });
      }

      if (ratingTrendsChartRef.current) ratingTrendsChartRef.current.destroy();
      const ctxRatingTrends = document
        .getElementById("productsRatingTrendsChart")
        ?.getContext("2d");
      if (ctxRatingTrends) {
        ratingTrendsChartRef.current = new Chart(ctxRatingTrends, {
          type: "line",
          data: {
            labels: productsData.productRatingTrends.map((r) => r.month),
            datasets: [
              {
                label: "Average Rating",
                data: productsData.productRatingTrends.map((r) => r.rating),
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true, max: 5 } } },
        });
      }

      return () => {
        if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
        if (topSellingChartRef.current) topSellingChartRef.current.destroy();
        if (ratingTrendsChartRef.current)
          ratingTrendsChartRef.current.destroy();
      };
    }, [dateRange]);

    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Sales Trend
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="productsSalesTrendChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Top 10 Selling Products
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="productsTopSellingChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Product Rating Trends
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="productsRatingTrendsChart"></canvas>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Stock Summary
          </h3>
          <PaginatedTable
            data={productsData.stockSummary}
            headers={["Name", "Stock", "Status"]}
            itemsPerPage={2}
            onRowClick={(item) => setSelectedItem(item)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {selectedItem.name} Details
              </h2>
              <p className="text-sm sm:text-base">
                Stock: {selectedItem.stock}, Status: {selectedItem.status}
              </p>
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

  // Orders Component
  const Orders = () => {
    const ordersByStatusChartRef = useRef(null);
    const paymentMethodsChartRef = useRef(null);
    const orderTimeTrendsChartRef = useRef(null);

    useEffect(() => {
      const ctxOrdersByStatus = document
        .getElementById("ordersByStatusChartOrders")
        ?.getContext("2d");
      if (ctxOrdersByStatus) {
        ordersByStatusChartRef.current = new Chart(ctxOrdersByStatus, {
          type: "bar",
          data: {
            labels: ordersData.ordersByStatus.map((o) => o.day),
            datasets: [
              {
                label: "Pending",
                data: ordersData.ordersByStatus.map((o) => o.pending),
                backgroundColor: "#FF6384",
              },
              {
                label: "Shipped",
                data: ordersData.ordersByStatus.map((o) => o.shipped),
                backgroundColor: "#36A2EB",
              },
              {
                label: "Delivered",
                data: ordersData.ordersByStatus.map((o) => o.delivered),
                backgroundColor: "#FFCE56",
              },
              {
                label: "Cancelled",
                data: ordersData.ordersByStatus.map((o) => o.cancelled),
                backgroundColor: "#FF9F40",
              },
            ],
          },
          options: {
            scales: {
              x: { stacked: true },
              y: { stacked: true, beginAtZero: true },
            },
          },
        });
      }

      const ctxPaymentMethods = document
        .getElementById("ordersPaymentMethodsChart")
        ?.getContext("2d");
      if (ctxPaymentMethods) {
        paymentMethodsChartRef.current = new Chart(ctxPaymentMethods, {
          type: "pie",
          data: {
            labels: Object.keys(ordersData.paymentMethods),
            datasets: [
              {
                data: Object.values(ordersData.paymentMethods),
                backgroundColor: ["#FF6384", "#36A2EB"],
              },
            ],
          },
        });
      }

      const ctxOrderTimeTrends = document
        .getElementById("ordersOrderTimeTrendsChart")
        ?.getContext("2d");
      if (ctxOrderTimeTrends) {
        orderTimeTrendsChartRef.current = new Chart(ctxOrderTimeTrends, {
          type: "line",
          data: {
            labels: ordersData.orderTimeTrends.map((t) => t.hour),
            datasets: [
              {
                label: "Orders",
                data: ordersData.orderTimeTrends.map((t) => t.orders),
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true } } },
        });
      }

      return () => {
        if (ordersByStatusChartRef.current)
          ordersByStatusChartRef.current.destroy();
        if (paymentMethodsChartRef.current)
          paymentMethodsChartRef.current.destroy();
        if (orderTimeTrendsChartRef.current)
          orderTimeTrendsChartRef.current.destroy();
      };
    }, []);

    return (
      <div>
        <Filters onDateChange={() => {}} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Orders by Status
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="ordersByStatusChartOrders"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Payment Method Usage
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="ordersPaymentMethodsChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Order Time Trends
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="ordersOrderTimeTrendsChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Users Component
  const Users = () => {
    const [tab, setTab] = useState("customers");
    const [selectedItem, setSelectedItem] = useState(null);
    const activeInactiveChartRef = useRef(null);
    const topCustomersChartRef = useRef(null);
    const retailerSalesChartRef = useRef(null);
    const activityChartRef = useRef(null);

    useEffect(() => {
      if (activeInactiveChartRef.current)
        activeInactiveChartRef.current.destroy();
      if (topCustomersChartRef.current) topCustomersChartRef.current.destroy();
      if (retailerSalesChartRef.current)
        retailerSalesChartRef.current.destroy();
      if (activityChartRef.current) activityChartRef.current.destroy();

      if (tab === "customers") {
        const ctxActiveInactive = document
          .getElementById("usersActiveInactiveChart")
          ?.getContext("2d");
        if (ctxActiveInactive) {
          activeInactiveChartRef.current = new Chart(ctxActiveInactive, {
            type: "doughnut",
            data: {
              labels: Object.keys(usersData.customers.activeVsInactive),
              datasets: [
                {
                  data: Object.values(usersData.customers.activeVsInactive),
                  backgroundColor: ["#36A2EB", "#FF6384"],
                },
              ],
            },
          });
        }

        const ctxTopCustomers = document
          .getElementById("usersTopCustomersChart")
          ?.getContext("2d");
        if (ctxTopCustomers) {
          topCustomersChartRef.current = new Chart(ctxTopCustomers, {
            type: "bar",
            data: {
              labels: usersData.customers.topCustomers.map((c) => c.name),
              datasets: [
                {
                  label: "Purchase Value",
                  data: usersData.customers.topCustomers.map(
                    (c) => c.purchaseValue
                  ),
                  backgroundColor: "rgba(153, 102, 255, 0.5)",
                  borderColor: "rgba(153, 102, 255, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: { scales: { y: { beginAtZero: true } } },
          });
        }

        const ctxActivity = document
          .getElementById("usersActivityChart")
          ?.getContext("2d");
        if (ctxActivity) {
          activityChartRef.current = new Chart(ctxActivity, {
            type: "bar",
            data: {
              labels: usersData.customers.purchaseFrequency.map((c) => c.name),
              datasets: [
                {
                  label: "Purchase Frequency",
                  data: usersData.customers.purchaseFrequency.map(
                    (c) => c.frequency
                  ),
                  backgroundColor: "rgba(34, 197, 94, 0.5)",
                  borderColor: "rgba(34, 197, 94, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: { y: { beginAtZero: true } },
              plugins: {
                legend: { position: "top" },
                tooltip: { enabled: true },
              },
            },
          });
        }
      } else {
        const ctxRetailerSales = document
          .getElementById("usersRetailerSalesChart")
          ?.getContext("2d");
        if (ctxRetailerSales) {
          retailerSalesChartRef.current = new Chart(ctxRetailerSales, {
            type: "line",
            data: {
              labels: usersData.retailers.salesVolume.map((r) => r.name),
              datasets: [
                {
                  label: "Sales Volume",
                  data: usersData.retailers.salesVolume.map((r) => r.sales),
                  borderColor: "rgba(255, 159, 64, 1)",
                  fill: false,
                },
              ],
            },
            options: { scales: { y: { beginAtZero: true } } },
          });
        }

        const ctxActivity = document
          .getElementById("usersActivityChart")
          ?.getContext("2d");
        if (ctxActivity) {
          activityChartRef.current = new Chart(ctxActivity, {
            type: "bar",
            data: {
              labels: usersData.retailers.activeListings.map((r) => r.name),
              datasets: [
                {
                  label: "Active Listings",
                  data: usersData.retailers.activeListings.map(
                    (r) => r.listings
                  ),
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
                tooltip: { enabled: true },
              },
            },
          });
        }
      }
    }, [tab]);

    return (
      <div>
        <Filters onDateChange={() => {}} />
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              tab === "customers" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("customers")}
          >
            Customers
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              tab === "retailers" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("retailers")}
          >
            Retailers
          </button>
        </div>
        {tab === "customers" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Active vs Inactive Users
              </h3>
              <div className="h-48 sm:h-64 lg:h-72">
                <canvas id="usersActiveInactiveChart"></canvas>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Top Customers by Purchase Value
              </h3>
              <div className="h-48 sm:h-64 lg:h-72">
                <canvas id="usersTopCustomersChart"></canvas>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Purchase Frequency
              </h3>
              <div className="h-48 sm:h-64 lg:h-72">
                <canvas id="usersActivityChart"></canvas>
              </div>
            </div>
          </div>
        )}
        {tab === "retailers" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Retailer Sales Volume
              </h3>
              <div className="h-48 sm:h-64 lg:h-72">
                <canvas id="usersRetailerSalesChart"></canvas>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Active Listings
              </h3>
              <div className="h-48 sm:h-64 lg:h-72">
                <canvas id="usersActivityChart"></canvas>
              </div>
            </div>
          </div>
        )}
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

  // Reviews Component
  const Reviews = () => {
    const ratingDistributionChartRef = useRef(null);
    const reviewVolumeChartRef = useRef(null);
    const sentimentChartRef = useRef(null);

    useEffect(() => {
      const ctxRatingDistribution = document
        .getElementById("reviewsRatingDistributionChart")
        ?.getContext("2d");
      if (ctxRatingDistribution) {
        ratingDistributionChartRef.current = new Chart(ctxRatingDistribution, {
          type: "bar",
          data: {
            labels: Object.keys(reviewsData.ratingDistribution),
            datasets: [
              {
                label: "Reviews",
                data: Object.values(reviewsData.ratingDistribution),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true } } },
        });
      }

      const ctxReviewVolume = document
        .getElementById("reviewsReviewVolumeChart")
        ?.getContext("2d");
      if (ctxReviewVolume) {
        reviewVolumeChartRef.current = new Chart(ctxReviewVolume, {
          type: "line",
          data: {
            labels: reviewsData.reviewVolume.map((r) => r.month),
            datasets: [
              {
                label: "Review Volume",
                data: reviewsData.reviewVolume.map((r) => r.volume),
                borderColor: "rgba(54, 162, 235, 1)",
                fill: false,
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true } } },
        });
      }

      const ctxSentiment = document
        .getElementById("reviewsSentimentChart")
        ?.getContext("2d");
      if (ctxSentiment) {
        sentimentChartRef.current = new Chart(ctxSentiment, {
          type: "pie",
          data: {
            labels: Object.keys(reviewsData.sentiment),
            datasets: [
              {
                data: Object.values(reviewsData.sentiment),
                backgroundColor: ["#36A2EB", "#FF6384"],
              },
            ],
          },
        });
      }

      return () => {
        if (ratingDistributionChartRef.current)
          ratingDistributionChartRef.current.destroy();
        if (reviewVolumeChartRef.current)
          reviewVolumeChartRef.current.destroy();
        if (sentimentChartRef.current) sentimentChartRef.current.destroy();
      };
    }, []);

    return (
      <div>
        <Filters onDateChange={() => {}} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Rating Distribution
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="reviewsRatingDistributionChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Review Volume
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="reviewsReviewVolumeChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Review Sentiment
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="reviewsSentimentChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Coupons Component
  const Coupons = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const usageRateChartRef = useRef(null);
    const couponTypeChartRef = useRef(null);

    useEffect(() => {
      const ctxUsageRate = document
        .getElementById("couponsUsageRateChart")
        ?.getContext("2d");
      if (ctxUsageRate) {
        usageRateChartRef.current = new Chart(ctxUsageRate, {
          type: "bar",
          data: {
            labels: couponsData.usageRate.map((c) => c.code),
            datasets: [
              {
                label: "Issued",
                data: couponsData.usageRate.map((c) => c.issued),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
              },
              {
                label: "Used",
                data: couponsData.usageRate.map((c) => c.used),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          },
          options: { scales: { y: { beginAtZero: true } } },
        });
      }

      const ctxCouponType = document
        .getElementById("couponsCouponTypeChart")
        ?.getContext("2d");
      if (ctxCouponType) {
        couponTypeChartRef.current = new Chart(ctxCouponType, {
          type: "doughnut",
          data: {
            labels: Object.keys(couponsData.couponTypeEffectiveness),
            datasets: [
              {
                data: Object.values(couponsData.couponTypeEffectiveness),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          },
        });
      }

      return () => {
        if (usageRateChartRef.current) usageRateChartRef.current.destroy();
        if (couponTypeChartRef.current) couponTypeChartRef.current.destroy();
      };
    }, []);

    return (
      <div>
        <Filters onDateChange={() => {}} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Coupon Usage Rate
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="couponsUsageRateChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Coupon Type Effectiveness
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="couponsCouponTypeChart"></canvas>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Expired/Unused Coupons
          </h3>
          <PaginatedTable
            data={couponsData.expiredUnused}
            headers={["Coupon Code", "Count"]}
            itemsPerPage={2}
            onRowClick={(item) => setSelectedItem(item)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {selectedItem.code} Details
              </h2>
              <p className="text-sm sm:text-base">
                Count: {selectedItem.count}
              </p>
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
        {activeSection === "orders" && <Orders />}
        {activeSection === "users" && <Users />}
        {activeSection === "reviews" && <Reviews />}
        {activeSection === "coupons" && <Coupons />}
      </div>
    </div>
  );
};

export default AnalyticDashboard;
