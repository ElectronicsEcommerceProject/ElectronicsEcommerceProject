import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PaginatedTable from "./shared/PaginatedTable.jsx";

import { getApi, adminReportsAnalyticsCouponsDataRoute } from "../../../src/index.js";

// Coupons Component
const Coupons = ({ dateRange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [couponsData, setCouponsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart refs
  const usageRateChartRef = useRef(null);
  const couponTypeChartRef = useRef(null);
  const redemptionTrendsChartRef = useRef(null);
  const topPerformingChartRef = useRef(null);

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

  // Fetch coupons data from API
  useEffect(() => {
    const fetchCouponsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = buildQueryParams(dateRange);
        const apiUrl = adminReportsAnalyticsCouponsDataRoute + `?${queryParams}`;
        console.log("Coupons API URL with params:", apiUrl);

        const response = await getApi(apiUrl);
        // console.log("Coupons API Response:", response);

        if (response.success) {
          setCouponsData(response.data);
        } else {
          setError("Failed to fetch coupons data");
        }
      } catch (err) {
        console.error("Error fetching coupons data:", err);
        setError("Error fetching coupons data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouponsData();
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
    if (!couponsData || isLoading) return;
    // Destroy existing charts if they exist
    if (usageRateChartRef.current) usageRateChartRef.current.destroy();
    if (couponTypeChartRef.current) couponTypeChartRef.current.destroy();
    if (redemptionTrendsChartRef.current) redemptionTrendsChartRef.current.destroy();
    if (topPerformingChartRef.current) topPerformingChartRef.current.destroy();

    // 1. Coupon Usage Stats Chart
    const ctxUsageRate = document
      .getElementById("couponsUsageRateChart")
      ?.getContext("2d");
    if (ctxUsageRate && couponsData.couponUsageStats && Array.isArray(couponsData.couponUsageStats) && couponsData.couponUsageStats.length > 0) {
      const usageStats = couponsData.couponUsageStats;
      usageRateChartRef.current = new Chart(ctxUsageRate, {
        type: "bar",
        data: {
          labels: usageStats.map((c) => c.code),
          datasets: [
            {
              label: "Usage Limit",
              data: usageStats.map((c) => Number(c.usageLimit) || 0),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Redemptions",
              data: usageStats.map((c) => Number(c.redemptionCount) || 0),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Coupon Usage Stats ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 2. Coupon Type Effectiveness Chart
    const ctxCouponType = document
      .getElementById("couponsCouponTypeChart")
      ?.getContext("2d");
    if (ctxCouponType && couponsData.couponTypeEffectiveness && typeof couponsData.couponTypeEffectiveness === 'object') {
      const typeData = couponsData.couponTypeEffectiveness;
      const labels = Object.keys(typeData);
      const data = labels.map(type => Number(typeData[type]?.totalDiscountAmount) || 0);

      if (labels.length > 0 && data.some(value => value > 0)) {
        couponTypeChartRef.current = new Chart(ctxCouponType, {
          type: "doughnut",
          data: {
            labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)), // Capitalize labels
            datasets: [
              {
                data: data,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: `Coupon Type Effectiveness ${getPeriodLabel(dateRange)}`,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    return `${label}: ₹${value.toLocaleString()}`;
                  }
                }
              }
            },
          },
        });
      }
    }

    // 3. Redemption Trends Chart
    const ctxRedemptionTrends = document
      .getElementById("couponsRedemptionTrendsChart")
      ?.getContext("2d");
    if (ctxRedemptionTrends && couponsData.redemptionTrends && Array.isArray(couponsData.redemptionTrends) && couponsData.redemptionTrends.length > 0) {
      const trendsData = couponsData.redemptionTrends;
      redemptionTrendsChartRef.current = new Chart(ctxRedemptionTrends, {
        type: "line",
        data: {
          labels: trendsData.map((d) => {
            try {
              return new Date(d.date).toLocaleDateString();
            } catch {
              return d.date;
            }
          }),
          datasets: [
            {
              label: "Redemption Count",
              data: trendsData.map((d) => Number(d.redemptionCount) || 0),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Total Discount Amount (₹)",
              data: trendsData.map((d) => Number(d.totalDiscountAmount) || 0),
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 2,
              fill: false,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              beginAtZero: true,
              title: { display: true, text: 'Redemption Count' }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              beginAtZero: true,
              title: { display: true, text: 'Discount Amount (₹)' },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Redemption Trends ${getPeriodLabel(dateRange)}`,
            },
          },
        },
      });
    }

    // 4. Top Performing Coupons Chart
    const ctxTopPerforming = document
      .getElementById("couponsTopPerformingChart")
      ?.getContext("2d");
    if (ctxTopPerforming && couponsData.topPerformingCoupons && Array.isArray(couponsData.topPerformingCoupons) && couponsData.topPerformingCoupons.length > 0) {
      const topCoupons = couponsData.topPerformingCoupons.slice(0, 10); // Show top 10
      topPerformingChartRef.current = new Chart(ctxTopPerforming, {
        type: "bar",
        data: {
          labels: topCoupons.map((c) => c.code),
          datasets: [
            {
              label: "Total Discount Amount (₹)",
              data: topCoupons.map((c) => Number(c.totalDiscountAmount) || 0),
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Discount Amount (₹)' }
            }
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Top Performing Coupons ${getPeriodLabel(dateRange)}`,
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y || 0;
                  return `Total Discount: ₹${value.toLocaleString()}`;
                }
              }
            }
          },
        },
      });
    }

    return () => {
      if (usageRateChartRef.current) usageRateChartRef.current.destroy();
      if (couponTypeChartRef.current) couponTypeChartRef.current.destroy();
      if (redemptionTrendsChartRef.current) redemptionTrendsChartRef.current.destroy();
      if (topPerformingChartRef.current) topPerformingChartRef.current.destroy();
    };
  }, [dateRange, couponsData, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg">Loading coupons data...</div>
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
  if (!couponsData) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-lg">No coupons data available</div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Coupon Usage Stats {getPeriodLabel(dateRange)}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="couponsUsageRateChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Coupon Type Effectiveness {getPeriodLabel(dateRange)}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="couponsCouponTypeChart"></canvas>
          </div>
        </div>
      </div>

      {/* Redemption Trends Chart */}
      <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Redemption Trends {getPeriodLabel(dateRange)}
        </h3>
        <div className="h-48 sm:h-64 lg:h-72">
          <canvas id="couponsRedemptionTrendsChart"></canvas>
        </div>
      </div>

      {/* Top Performing Coupons Chart */}
      <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Top Performing Coupons {getPeriodLabel(dateRange)}
        </h3>
        <div className="h-48 sm:h-64 lg:h-72">
          <canvas id="couponsTopPerformingChart"></canvas>
        </div>
      </div>

      {/* Expired/Unused Coupons Table */}
      <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Expired/Unused Coupons {getPeriodLabel(dateRange)}
        </h3>
        <PaginatedTable
          data={(couponsData?.expiredUnusedCoupons || []).map(item => ({
            "Coupon Code": item.code || item.couponCode || "N/A",
            "Discount Value": item.discountValue ? `₹${item.discountValue}` : "N/A",
            // Keep original item for modal
            _originalItem: item
          }))}
          headers={["Coupon Code", "Discount Value"]}
          itemsPerPage={5}
          onRowClick={(item) => setSelectedItem(item._originalItem || item)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {selectedItem?.code || selectedItem?.couponCode || "Coupon"} Details
            </h2>
            <div className="text-sm sm:text-base space-y-2">
              {selectedItem?.couponId && (
                <p>
                  <strong>Coupon ID:</strong> {selectedItem.couponId}
                </p>
              )}
              {selectedItem?.code && (
                <p>
                  <strong>Code:</strong> {selectedItem.code}
                </p>
              )}
              {selectedItem?.type && (
                <p>
                  <strong>Type:</strong> {selectedItem.type}
                </p>
              )}
              {selectedItem?.discountValue !== undefined && (
                <p>
                  <strong>Discount Value:</strong> ₹{selectedItem.discountValue}
                </p>
              )}
              {selectedItem?.usageLimit !== undefined && (
                <p>
                  <strong>Usage Limit:</strong> {selectedItem.usageLimit}
                </p>
              )}
              {selectedItem?.redemptionCount !== undefined && (
                <p>
                  <strong>Redemptions:</strong> {selectedItem.redemptionCount}
                </p>
              )}
              {selectedItem?.totalDiscountAmount !== undefined && (
                <p>
                  <strong>Total Discount Amount:</strong> ₹{selectedItem.totalDiscountAmount}
                </p>
              )}
              {selectedItem?.usageRate !== undefined && (
                <p>
                  <strong>Usage Rate:</strong> {(Number(selectedItem.usageRate) * 100).toFixed(1)}%
                </p>
              )}
              {selectedItem?.validFrom && (
                <p>
                  <strong>Valid From:</strong> {new Date(selectedItem.validFrom).toLocaleDateString()}
                </p>
              )}
              {selectedItem?.validTo && (
                <p>
                  <strong>Valid To:</strong> {new Date(selectedItem.validTo).toLocaleDateString()}
                </p>
              )}
              {selectedItem?.isActive !== undefined && (
                <p>
                  <strong>Status:</strong> {selectedItem.isActive ? "Active" : "Inactive"}
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

export default Coupons;
