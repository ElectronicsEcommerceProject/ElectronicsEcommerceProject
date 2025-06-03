import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PaginatedTable from "./shared/PaginatedTable.jsx";
import { filterDataByDateRange, getChartTitle, getYAxisTitle } from "./shared/analyticsUtils.js";
import { generateTimelineData, productsData } from "./shared/analyticsData.js";

// Products Component
const Products = ({ dateRange }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const topSellingChartRef = useRef(null);
  const ratingTrendsChartRef = useRef(null);
  const salesTrendChartRef = useRef(null);

  const timelineData = generateTimelineData();

  useEffect(() => {
    const filteredData = filterDataByDateRange(timelineData, dateRange);

    if (salesTrendChartRef.current) salesTrendChartRef.current.destroy();
    const ctxSalesTrend = document
      .getElementById("productsSalesTrendChart")
      ?.getContext("2d");
    if (ctxSalesTrend) {
      // Determine chart title based on filter
      const chartTitle = getChartTitle("Timeline", dateRange, "Product Sales");
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
            Sales Trend{" "}
            {typeof dateRange === "string"
              ? `(${dateRange})`
              : "(Custom Range)"}
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

export default Products;
