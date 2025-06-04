import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PaginatedTable from "./shared/PaginatedTable.jsx";
import { couponsData } from "./shared/analyticsData.js";

// Coupons Component
const Coupons = ({ dateRange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const usageRateChartRef = useRef(null);
  const couponTypeChartRef = useRef(null);

  useEffect(() => {
    // Destroy existing charts if they exist
    if (usageRateChartRef.current) usageRateChartRef.current.destroy();
    if (couponTypeChartRef.current) couponTypeChartRef.current.destroy();

    const ctxUsageRate = document
      .getElementById("couponsUsageRateChart")
      ?.getContext("2d");
    if (ctxUsageRate && couponsData?.usageRate) {
      usageRateChartRef.current = new Chart(ctxUsageRate, {
        type: "bar",
        data: {
          labels: couponsData.usageRate.map((c) => c.code),
          datasets: [
            {
              label: "Issued",
              data: couponsData.usageRate.map((c) => c.issued),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Used",
              data: couponsData.usageRate.map((c) => c.used),
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
              text: `Coupon Usage Rate ${
                typeof dateRange === "string"
                  ? `(${dateRange})`
                  : "(Custom Range)"
              }`,
            },
          },
        },
      });
    }

    const ctxCouponType = document
      .getElementById("couponsCouponTypeChart")
      ?.getContext("2d");
    if (ctxCouponType && couponsData?.couponTypeEffectiveness) {
      couponTypeChartRef.current = new Chart(ctxCouponType, {
        type: "doughnut",
        data: {
          labels: Object.keys(couponsData.couponTypeEffectiveness),
          datasets: [
            {
              data: Object.values(couponsData.couponTypeEffectiveness),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
              text: `Coupon Type Effectiveness ${
                typeof dateRange === "string"
                  ? `(${dateRange})`
                  : "(Custom Range)"
              }`,
            },
          },
        },
      });
    }

    return () => {
      if (usageRateChartRef.current) usageRateChartRef.current.destroy();
      if (couponTypeChartRef.current) couponTypeChartRef.current.destroy();
    };
  }, [dateRange]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Coupon Usage Rate{" "}
            {typeof dateRange === "string"
              ? `(${dateRange})`
              : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="couponsUsageRateChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Coupon Type Effectiveness{" "}
            {typeof dateRange === "string"
              ? `(${dateRange})`
              : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="couponsCouponTypeChart"></canvas>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Expired/Unused Coupons{" "}
          {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
        </h3>
        <PaginatedTable
          data={couponsData?.expiredUnused || []}
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
              {selectedItem?.code || selectedItem?.name || "Item"} Details
            </h2>
            <p className="text-sm sm:text-base">
              Count: {selectedItem?.count || "N/A"}
            </p>
            {selectedItem?.details && (
              <p className="text-sm sm:text-base mt-2">
                {selectedItem.details}
              </p>
            )}
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
