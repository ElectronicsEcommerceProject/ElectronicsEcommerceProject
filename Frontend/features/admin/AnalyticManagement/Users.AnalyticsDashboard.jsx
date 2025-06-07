import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { usersData } from "./shared/analyticsData.js";

// Users Component
const Users = ({ dateRange }) => {
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
  }, [tab, dateRange]);

  return (
    <div>
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
              Active vs Inactive Users {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="usersActiveInactiveChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Top Customers by Purchase Value {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="usersTopCustomersChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Purchase Frequency {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
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
              Retailer Sales Volume {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <canvas id="usersRetailerSalesChart"></canvas>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Active Listings {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
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

export default Users;
