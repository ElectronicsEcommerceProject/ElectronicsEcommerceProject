import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PaginatedTable from "./shared/PaginatedTable.jsx";
import {
  filterDataByDateRange,
  getChartTitle,
  getYAxisTitle,
} from "./shared/analyticsUtils.js";
import { generateTimelineData, dashboardData } from "./shared/analyticsData.js";

// Dashboard Component
const Dashboard = ({ dateRange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const gaugeRef = useRef(null);
  const ordersChartRef = useRef(null);
  const comparisonChartRef = useRef(null);
  const salesTrendChartRef = useRef(null);

  const timelineData = generateTimelineData();

  useEffect(() => {
    const filteredData = filterDataByDateRange(timelineData, dateRange);

    if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
    const ctxSalesTrend = document
      .getElementById("dashboardSalesTrendChart")
      ?.getContext("2d");
    if (ctxSalesTrend) {
      // Determine chart title based on filter
      const chartTitle = getChartTitle("Timeline", dateRange);
      const yAxisTitle = getYAxisTitle("Sales ($)", dateRange);

      salesTrendChartRef.current = new Chart(ctxSalesTrend, {
        type: "line",
        data: {
          labels: filteredData.map((d) => d.label || d.month),
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
              title: { display: true, text: yAxisTitle },
              stacked: true,
            },
            x: { title: { display: true, text: chartTitle } },
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
      const value = dashboardData.customerSatisfaction;
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
            Sales Trend{" "}
            {typeof dateRange === "string"
              ? `(${dateRange})`
              : "(Custom Range)"}
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

export default Dashboard;
