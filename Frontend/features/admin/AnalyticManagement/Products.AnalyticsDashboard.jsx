import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PaginatedTable from "./shared/PaginatedTable.jsx";
import { dashboardData } from "./shared/analyticsData.js";

// Products Component
const Products = ({ dateRange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTermWorst, setSearchTermWorst] = useState("");
  const [searchTermWishlist, setSearchTermWishlist] = useState("");
  const [searchTermOutOfStock, setSearchTermOutOfStock] = useState("");

  // Chart refs
  const salesTrendChartRef = useRef(null);
  const topSellingChartRef = useRef(null);
  const ratingTrendsChartRef = useRef(null);
  const categoryPerformanceChartRef = useRef(null);

  // Helper function to get data based on dropdown selection
  const getDataByPeriod = (dataObj, period) => {
    if (typeof period === "string") {
      const key = period.toLowerCase();
      return dataObj[key] || dataObj.month || dataObj;
    }
    return dataObj.month || dataObj; // Default to month for custom ranges
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
    if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
    if (topSellingChartRef.current) topSellingChartRef.current.destroy();
    if (ratingTrendsChartRef.current) ratingTrendsChartRef.current.destroy();
    if (categoryPerformanceChartRef.current)
      categoryPerformanceChartRef.current.destroy();

    // 1. Enhanced Sales Trend Chart (based on dropdown)
    const ctxSalesTrend = document
      .getElementById("productsSalesTrendChart")
      ?.getContext("2d");
    if (ctxSalesTrend) {
      const revenueData = getDataByPeriod(
        dashboardData.revenueOverTime,
        dateRange
      );
      salesTrendChartRef.current = new Chart(ctxSalesTrend, {
        type: "line",
        data: {
          labels: revenueData.map((d) => d.period),
          datasets: [
            {
              label: "Product Sales Revenue",
              data: revenueData.map((d) => d.revenue),
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#3B82F6",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
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
              grid: { color: "rgba(0, 0, 0, 0.1)" },
            },
            x: {
              title: { display: true, text: "Time Period" },
              grid: { color: "rgba(0, 0, 0, 0.1)" },
            },
          },
          plugins: {
            legend: {
              position: "top",
              labels: { usePointStyle: true },
            },
            title: {
              display: true,
              text: `Product Sales Trend ${getPeriodLabel(dateRange)}`,
              font: { size: 16, weight: "bold" },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      });
    }

    // 2. Enhanced Top Selling Products Chart
    const ctxTopSelling = document
      .getElementById("productsTopSellingChart")
      ?.getContext("2d");
    if (ctxTopSelling && dashboardData?.topSellingProducts) {
      topSellingChartRef.current = new Chart(ctxTopSelling, {
        type: "bar",
        data: {
          labels: dashboardData.topSellingProducts.map((p) => p.name),
          datasets: [
            {
              label: "Sales Volume",
              data: dashboardData.topSellingProducts.map((p) => p.sales),
              backgroundColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
              ],
              borderWidth: 0,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true,
              title: { display: true, text: "Sales Volume" },
              grid: { color: "rgba(0, 0, 0, 0.1)" },
            },
            y: {
              grid: { display: false },
            },
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Top 5 Selling Products ${getPeriodLabel(dateRange)}`,
              font: { size: 16, weight: "bold" },
            },
          },
        },
      });
    }

    // 3. Enhanced Product Ratings Chart
    const ctxRatingTrends = document
      .getElementById("productsRatingTrendsChart")
      ?.getContext("2d");
    if (ctxRatingTrends && dashboardData?.productRatings) {
      // Get rating data based on dropdown selection
      const ratingData = getDataByPeriod(
        dashboardData.productRatingTrends,
        dateRange
      );

      ratingTrendsChartRef.current = new Chart(ctxRatingTrends, {
        type: "bar",
        data: {
          labels: ratingData.map((r) => r.period),
          datasets: [
            {
              label: "Average Rating",
              data: ratingData.map((r) => r.rating),
              backgroundColor: "rgba(34, 197, 94, 0.8)",
              borderColor: "#22C55E",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: "Review Count",
              data: ratingData.map((r) => r.reviewCount || r.rating * 20), // Fallback calculation
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "#3B82F6",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          scales: {
            x: {
              grid: { color: "rgba(0, 0, 0, 0.1)" },
              title: { display: true, text: "Time Period" },
            },
            y: {
              type: "linear",
              display: true,
              position: "left",
              beginAtZero: true,
              max: 5,
              title: { display: true, text: "Average Rating" },
              grid: { color: "rgba(0, 0, 0, 0.1)" },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              beginAtZero: true,
              title: { display: true, text: "Review Count" },
              grid: { drawOnChartArea: false },
            },
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                padding: 20,
                usePointStyle: true,
                font: { size: 12 },
              },
            },
            title: {
              display: true,
              text: `Product Ratings Trend ${getPeriodLabel(dateRange)}`,
              font: { size: 16, weight: "bold" },
            },
            tooltip: {
              callbacks: {
                afterLabel: function (context) {
                  if (context.datasetIndex === 0) {
                    return `Rating: ${context.parsed.y}/5`;
                  } else {
                    return `Reviews: ${context.parsed.y}`;
                  }
                },
              },
            },
          },
        },
      });
    }

    // 4. Category Performance Chart
    const ctxCategoryPerformance = document
      .getElementById("productsCategoryPerformanceChart")
      ?.getContext("2d");
    if (ctxCategoryPerformance && dashboardData?.salesByCategory) {
      const categoryData = getDataByPeriod(
        dashboardData.salesByCategory,
        dateRange
      );
      categoryPerformanceChartRef.current = new Chart(ctxCategoryPerformance, {
        type: "doughnut",
        data: {
          labels: Object.keys(categoryData),
          datasets: [
            {
              label: "Category Sales",
              data: Object.values(categoryData),
              backgroundColor: [
                "rgba(59, 130, 246, 0.9)",
                "rgba(16, 185, 129, 0.9)",
                "rgba(245, 158, 11, 0.9)",
                "rgba(239, 68, 68, 0.9)",
                "rgba(139, 92, 246, 0.9)",
                "rgba(236, 72, 153, 0.9)",
              ],
              borderColor: [
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#8B5CF6",
                "#EC4899",
              ],
              borderWidth: 3,
              hoverBackgroundColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(236, 72, 153, 1)",
              ],
              hoverBorderWidth: 4,
              cutout: "50%",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
          },
          plugins: {
            legend: {
              position: "right",
              labels: {
                padding: 20,
                usePointStyle: true,
                font: { size: 12, weight: "bold" },
                generateLabels: function (chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const value = data.datasets[0].data[i];
                      const total = data.datasets[0].data.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percentage = ((value / total) * 100).toFixed(1);
                      return {
                        text: `${label}: ${percentage}%`,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        strokeStyle: data.datasets[0].borderColor[i],
                        lineWidth: data.datasets[0].borderWidth,
                        hidden: false,
                        index: i,
                      };
                    });
                  }
                  return [];
                },
              },
            },
            title: {
              display: true,
              text: `Category Performance ${getPeriodLabel(dateRange)}`,
              font: { size: 16, weight: "bold" },
              padding: { bottom: 20 },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                },
              },
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 1,
            },
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
          },
        },
      });
    }

    return () => {
      if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
      if (topSellingChartRef.current) topSellingChartRef.current.destroy();
      if (ratingTrendsChartRef.current) ratingTrendsChartRef.current.destroy();
      if (categoryPerformanceChartRef.current)
        categoryPerformanceChartRef.current.destroy();
    };
  }, [dateRange]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Product Sales Trend {getPeriodLabel(dateRange)}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="productsSalesTrendChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Top 5 Selling Products {getPeriodLabel(dateRange)}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="productsTopSellingChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Product Ratings Trend {getPeriodLabel(dateRange)}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="productsRatingTrendsChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Category Performance {getPeriodLabel(dateRange)}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="productsCategoryPerformanceChart"></canvas>
          </div>
        </div>
      </div>

      {/* Product Performance Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow w-full overflow-x-hidden">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Worst-Selling Products (Bottom 5)
          </h3>
          <div className="w-full overflow-x-hidden">
            <PaginatedTable
              data={dashboardData?.worstSellingProducts || []}
              headers={["Name", "Sales"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item)}
              searchTerm={searchTermWorst}
              setSearchTerm={setSearchTermWorst}
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow w-full overflow-x-hidden">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Top Wishlisted Products
          </h3>
          <div className="w-full overflow-x-hidden">
            <PaginatedTable
              data={dashboardData?.topWishlistedProducts || []}
              headers={["Product Name", "Wishlist Count"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item)}
              searchTerm={searchTermWishlist}
              setSearchTerm={setSearchTermWishlist}
            />
          </div>
        </div>
      </div>

      {/* Out of Stock Products Section - now occupies the full width or half if another table is added back */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
        {" "}
        {/* Adjusted grid to single column for this item or make it lg:grid-cols-2 if you plan to add another table here */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow w-full overflow-x-hidden">
          <h3 className="text-base sm:text-lg font-semibold mb-2 break-words">
            Out-of-Stock Products
          </h3>
          <div className="w-full overflow-x-hidden">
            <PaginatedTable
              data={dashboardData?.outOfStockProducts || []}
              headers={["Name", "Stock", "Category"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item)}
              searchTerm={searchTermOutOfStock}
              setSearchTerm={setSearchTermOutOfStock}
            />
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {selectedItem?.name || selectedItem?.code || "Product"} Details
            </h2>
            <div className="text-sm sm:text-base space-y-2">
              {selectedItem?.sales && (
                <p>
                  <strong>Sales:</strong> {selectedItem.sales}
                </p>
              )}
              {selectedItem?.rating && (
                <p>
                  <strong>Rating:</strong> {selectedItem.rating}/5
                </p>
              )}
              {selectedItem?.reviews && (
                <p>
                  <strong>Reviews:</strong> {selectedItem.reviews}
                </p>
              )}
              {selectedItem?.wishlistCount && (
                <p>
                  <strong>Wishlist Count:</strong> {selectedItem.wishlistCount}
                </p>
              )}
              {selectedItem?.stock !== undefined && (
                <p>
                  <strong>Stock:</strong> {selectedItem.stock}
                </p>
              )}
              {selectedItem?.category && (
                <p>
                  <strong>Category:</strong> {selectedItem.category}
                </p>
              )}
              {selectedItem?.status && (
                <p>
                  <strong>Status:</strong> {selectedItem.status}
                </p>
              )}
            </div>
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

export default Products;
