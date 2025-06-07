import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PaginatedTable from "./shared/PaginatedTable.jsx";

import { getApi, adminReportsAnalyticsProductsDataRoute } from "../../../src/index.js";

// Products Component
const Products = ({ dateRange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTermWorst, setSearchTermWorst] = useState("");
  const [searchTermWishlist, setSearchTermWishlist] = useState("");
  const [searchTermOutOfStock, setSearchTermOutOfStock] = useState("");
  const [productsData, setProductsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart refs
  const salesTrendChartRef = useRef(null);
  const topSellingChartRef = useRef(null);
  const ratingTrendsChartRef = useRef(null);
  const categoryPerformanceChartRef = useRef(null);

  // Helper function to build query parameters based on dateRange
  const buildQueryParams = (dateRange) => {
    const params = new URLSearchParams();

    if (typeof dateRange === "string") {
      // Handle predefined periods: "Today", "Week", "Month"
      const periodMap = {
        "Today": "day",
        "Week": "week",
        "Month": "month"
      };
      params.append("period", periodMap[dateRange] || "month");
    } else if (dateRange && dateRange.start && dateRange.end) {
      // Handle custom date range
      params.append("period", "custom");
      params.append("startDate", dateRange.start);
      params.append("endDate", dateRange.end);
    } else {
      // Default fallback
      params.append("period", "month");
    }

    return params.toString();
  };

  // Fetch products data from API
  useEffect(() => {
    const fetchProductsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = buildQueryParams(dateRange);
        const apiUrl = adminReportsAnalyticsProductsDataRoute + `?${queryParams}`;
        console.log("Products API URL with params:", apiUrl);

        const response = await getApi(apiUrl);
        // console.log("Products API Response:", response);

        if (response.success) {
          setProductsData(response.data);
        } else {
          setError("Failed to fetch products data");
        }
      } catch (err) {
        console.error("Error fetching products data:", err);
        setError("Error fetching products data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsData();
  }, [dateRange]);

  // Helper function to get period label
  const getPeriodLabel = (period) => {
    if (typeof period === "string") {
      return `(${period})`;
    }
    return "(Custom Range)";
  };

  useEffect(() => {
    // Don't render charts if data is not loaded yet
    if (!productsData || isLoading) return;

    // Destroy existing charts if they exist
    if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
    if (topSellingChartRef.current) topSellingChartRef.current.destroy();
    if (ratingTrendsChartRef.current) ratingTrendsChartRef.current.destroy();
    if (categoryPerformanceChartRef.current)
      categoryPerformanceChartRef.current.destroy();

    // 1. Enhanced Sales Trend Chart (based on API data)
    const ctxSalesTrend = document
      .getElementById("productsSalesTrendChart")
      ?.getContext("2d");
    if (ctxSalesTrend && productsData.revenueOverTime && Array.isArray(productsData.revenueOverTime) && productsData.revenueOverTime.length > 0) {
      const revenueData = productsData.revenueOverTime;
      salesTrendChartRef.current = new Chart(ctxSalesTrend, {
        type: "line",
        data: {
          labels: revenueData.map((d) => {
            // Handle period formatting - could be date string or period name
            try {
              return new Date(d.period).toLocaleDateString();
            } catch {
              return d.period; // Fallback to original period string
            }
          }),
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
    if (ctxTopSelling && productsData.topSellingProducts && Array.isArray(productsData.topSellingProducts) && productsData.topSellingProducts.length > 0) {
      topSellingChartRef.current = new Chart(ctxTopSelling, {
        type: "bar",
        data: {
          labels: productsData.topSellingProducts.map((p) => p.name || p.productName),
          datasets: [
            {
              label: "Sales Volume",
              data: productsData.topSellingProducts.map((p) => p.sales || p.salesCount || p.quantity),
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
    if (ctxRatingTrends && productsData.productRatingTrends && Array.isArray(productsData.productRatingTrends) && productsData.productRatingTrends.length > 0) {
      const ratingData = productsData.productRatingTrends;

      ratingTrendsChartRef.current = new Chart(ctxRatingTrends, {
        type: "bar",
        data: {
          labels: ratingData.map((r) => {
            // Handle period formatting
            try {
              return new Date(r.period).toLocaleDateString();
            } catch {
              return r.period; // Fallback to original period string
            }
          }),
          datasets: [
            {
              label: "Average Rating",
              data: ratingData.map((r) => parseFloat(r.rating) || 0),
              backgroundColor: "rgba(34, 197, 94, 0.8)",
              borderColor: "#22C55E",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: "Review Count",
              data: ratingData.map((r) => r.reviewCount || 0),
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
    if (ctxCategoryPerformance && productsData.salesByCategory && typeof productsData.salesByCategory === 'object' && Object.keys(productsData.salesByCategory).length > 0) {
      // Convert object to array format for the doughnut chart
      const categoryData = Object.entries(productsData.salesByCategory).map(([category, revenue]) => ({
        category,
        revenue: Number(revenue) || 0
      }));

      // Only render if we have data with valid values
      if (categoryData.length > 0 && categoryData.some(item => item.revenue > 0)) {
        categoryPerformanceChartRef.current = new Chart(ctxCategoryPerformance, {
          type: "doughnut",
          data: {
            labels: categoryData.map(item => item.category),
            datasets: [
              {
                label: "Category Sales",
                data: categoryData.map(item => item.revenue || 0),
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
    }

    return () => {
      if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
      if (topSellingChartRef.current) topSellingChartRef.current.destroy();
      if (ratingTrendsChartRef.current) ratingTrendsChartRef.current.destroy();
      if (categoryPerformanceChartRef.current)
        categoryPerformanceChartRef.current.destroy();
    };
  }, [dateRange, productsData, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg">Loading products data...</div>
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
  if (!productsData) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg">No products data available</div>
      </div>
    );
  }

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
              data={(productsData?.worstSellingProducts || []).map(item => ({
                Name: item.name,
                Sales: item.sales,
                // Keep original item for modal
                _originalItem: item
              }))}
              headers={["Name", "Sales"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item._originalItem || item)}
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
              data={(productsData?.topWishlistedProducts || []).map(item => ({
                "Product Name": item.name,
                "Wishlist Count": item.wishlistCount,
                // Keep original item for modal
                _originalItem: item
              }))}
              headers={["Product Name", "Wishlist Count"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item._originalItem || item)}
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
              data={(productsData?.outOfStockProducts || []).map(item => ({
                Name: item.name,
                Stock: item.stock !== undefined ? item.stock : 0,
                Category: item.category || "N/A",
                // Keep original item for modal
                _originalItem: item
              }))}
              headers={["Name", "Stock", "Category"]}
              itemsPerPage={3}
              onRowClick={(item) => setSelectedItem(item._originalItem || item)}
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
              {selectedItem?.name || "Product"} Details
            </h2>
            <div className="text-sm sm:text-base space-y-2">
              {selectedItem?.productId && (
                <p>
                  <strong>Product ID:</strong> {selectedItem.productId}
                </p>
              )}
              {selectedItem?.name && (
                <p>
                  <strong>Name:</strong> {selectedItem.name}
                </p>
              )}
              {selectedItem?.sales !== undefined && (
                <p>
                  <strong>Sales:</strong> {selectedItem.sales}
                </p>
              )}
              {selectedItem?.wishlistCount !== undefined && (
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
