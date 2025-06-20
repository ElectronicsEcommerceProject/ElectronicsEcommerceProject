import React, { useState } from "react";
import OrderStatus from "./OrderStatus.jsx";
import { useNavigate } from "react-router-dom";

const dummyOrders = [
  {
    id: 1,
    status: "delivered",
    statusText: "Delivery between 08:00 AM - 07:55 PM on JUN 17",
    message: "Your Order has been placed.",
    orderDate: "2024-06-17",
    items: [
      {
        id: "1a",
        image: "https://via.placeholder.com/80",
        title: "JACY LONIDON HARD SIDED PC 8 WHEEL SPINNE...",
        color: "Blue",
        price: "₹1,908",
        quantity: 1,
      },
      {
        id: "1b",
        image: "https://via.placeholder.com/80",
        title: "Boat Rockerz 650 Pro, Touch/Swipe Contro...",
        color: "Silver",
        price: "₹2,518",
        quantity: 2,
      },
    ],
  },
  {
    id: 2,
    status: "cancelled",
    statusText: "Cancelled on MAY 05",
    orderDate: "2024-05-05",
    items: [
      {
        id: "2a",
        image: "https://via.placeholder.com/80",
        title: "Wild Stone ULTRA SENSUAL Eau de Parfum ...",
        price: "₹305",
        quantity: 1,
      },
    ],
  },
];

const FilterSidebar = ({
  orderStatusFilters,
  setOrderStatusFilters,
  orderTimeFilters,
  setOrderTimeFilters,
}) => {
  const statusOptions = [
    { key: "onTheWay", label: "On the way" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "returned", label: "Returned" },
  ];

  const timeOptions = [
    { key: "last30Days", label: "Last 30 days" },
    { key: "year2024", label: "2024" },
    { key: "year2023", label: "2023" },
    { key: "year2022", label: "2022" },
    { key: "year2021", label: "2021" },
    { key: "older", label: "Older" },
  ];

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">FILTERS</h3>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          ORDER STATUS
        </h4>
        {statusOptions.map(({ key, label }) => (
          <label key={key} className="block mb-1 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mr-2 cursor-pointer"
              checked={orderStatusFilters[key]}
              onChange={() =>
                setOrderStatusFilters({
                  ...orderStatusFilters,
                  [key]: !orderStatusFilters[key],
                })
              }
            />
            {label}
          </label>
        ))}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-3">
          ORDER TIME
        </h4>
        {timeOptions.map(({ key, label }) => (
          <label key={key} className="block mb-1 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mr-2 cursor-pointer"
              checked={orderTimeFilters[key]}
              onChange={() =>
                setOrderTimeFilters({
                  ...orderTimeFilters,
                  [key]: !orderTimeFilters[key],
                })
              }
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ order, expanded, onExpand }) => {
  return (
    <div className="w-full bg-white p-4 mb-4 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-shadow duration-200">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer"
        onClick={onExpand}
      >
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-800">
            Order #{order.id}
          </h4>
          <p
            className={`text-sm font-bold ${
              order.status === "delivered" ? "text-green-600" : "text-red-600"
            }`}
          >
            {order.statusText}
          </p>
          <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <span className="text-blue-600 text-sm font-medium mr-2">
            {expanded ? "Hide Items" : "Show Items"}
          </span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 border-t pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center mb-3">
              <img
                src={item.image}
                alt="Product"
                className="w-16 h-16 rounded mr-4"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">{item.title}</div>
                {item.color && (
                  <div className="text-sm text-gray-500">
                    Color: {item.color}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </div>
                <div className="text-sm text-gray-700 font-semibold">
                  {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <div className="w-full flex items-center mb-4 space-x-2">
    <input
      type="text"
      placeholder="Search your orders here"
      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button
      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      onClick={handleSearch}
    >
      Search Orders
    </button>
  </div>
);

const OrderDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilters, setOrderStatusFilters] = useState({
    onTheWay: false,
    delivered: false,
    cancelled: false,
    returned: false,
  });
  const [orderTimeFilters, setOrderTimeFilters] = useState({
    last30Days: false,
    year2024: false,
    year2023: false,
    year2022: false,
    year2021: false,
    older: false,
  });
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  const filteredOrders = dummyOrders.filter((order) => {
    const statusMatch =
      !Object.values(orderStatusFilters).some(Boolean) ||
      (orderStatusFilters.delivered && order.status === "delivered") ||
      (orderStatusFilters.cancelled && order.status === "cancelled") ||
      (orderStatusFilters.onTheWay && order.status === "onTheWay") ||
      (orderStatusFilters.returned && order.status === "returned");

    const orderDate = new Date(order.orderDate);
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const timeMatch =
      !Object.values(orderTimeFilters).some(Boolean) ||
      (orderTimeFilters.last30Days && orderDate >= thirtyDaysAgo) ||
      (orderTimeFilters.year2024 && orderDate.getFullYear() === 2024) ||
      (orderTimeFilters.year2023 && orderDate.getFullYear() === 2023) ||
      (orderTimeFilters.year2022 && orderDate.getFullYear() === 2022) ||
      (orderTimeFilters.year2021 && orderDate.getFullYear() === 2021) ||
      (orderTimeFilters.older && orderDate.getFullYear() < 2021);

    const searchMatch = searchQuery
      ? order.items.some((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    return statusMatch && timeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto flex flex-col sm:flex-row p-4 gap-3">
        <div className="w-full sm:w-48">
          <FilterSidebar
            orderStatusFilters={orderStatusFilters}
            setOrderStatusFilters={setOrderStatusFilters}
            orderTimeFilters={orderTimeFilters}
            setOrderTimeFilters={setOrderTimeFilters}
          />
        </div>
        <div className="w-full flex-1 p-4 pt-0">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrderId === order.id}
                onExpand={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id ? null : order.id
                  )
                }
              />
            ))
          ) : (
            <p className="text-sm text-gray-600">
              No orders match the selected filters or search query.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
