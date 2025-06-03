import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ordersData } from "./shared/analyticsData.js";

// Orders Component
const Orders = ({ dateRange }) => {
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
  }, [dateRange]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Orders by Status {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="ordersByStatusChartOrders"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Payment Method Usage {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="ordersPaymentMethodsChart"></canvas>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Order Time Trends {typeof dateRange === "string" ? `(${dateRange})` : "(Custom Range)"}
          </h3>
          <div className="h-48 sm:h-64 lg:h-72">
            <canvas id="ordersOrderTimeTrendsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
