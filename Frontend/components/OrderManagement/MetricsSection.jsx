import React from "react";

const MetricsSection = ({ totalOrders }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {[
      { title: "Total Orders", value: totalOrders?.all || 0 },
      { title: "Pending Orders", value: totalOrders?.pending || 0 },
      { title: "Shipped Orders", value: totalOrders?.shipped || 0 },
      { title: "Cancelled/Returned", value: totalOrders?.cancelled || 0 },
    ].map((metric, index) => (
      <div
        key={index}
        className="bg-white p-6 rounded-lg shadow text-center transform hover:scale-105 transition"
      >
        <h3 className="text-lg font-semibold text-gray-700">{metric.title}</h3>
        <p className="text-3xl font-bold text-blue-600">{metric.value}</p>
      </div>
    ))}
  </div>
);

export default MetricsSection;
