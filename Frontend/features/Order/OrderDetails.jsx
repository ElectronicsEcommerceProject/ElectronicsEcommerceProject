import React, { useState, useEffect } from "react";
import OrderStatus from "./OrderStatus.jsx";
import { useNavigate } from "react-router-dom";

import {
  getApi,
  orderRoute,
  getApiById,
  getUserIdFromToken,
  orderItemByOrderIdRoute,
} from "../../src/index.js";

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
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const handleShowItems = async () => {
    // alert(`Order ID: ${order.order_id}`);

    if (!expanded) {
      setLoadingItems(true);
      try {
        const response = await getApiById(
          orderItemByOrderIdRoute,
          order.order_id
        );
        if (response.data) {
          setOrderItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
      } finally {
        setLoadingItems(false);
      }
    }

    onExpand();
  };

  return (
    <div className="w-full bg-white p-4 mb-4 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-shadow duration-200">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer"
        onClick={handleShowItems}
      >
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-800">
            Order #{order.order_number}
          </h4>
          <p
            className={`text-sm font-bold ${
              order.order_status === "delivered"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Status: {order.order_status}
          </p>
          <p className="text-xs text-gray-500">
            Order Date: {new Date(order.order_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-700 font-semibold">
            Total: ₹{order.total_amount}
          </p>
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
          {loadingItems ? (
            <p className="text-sm text-gray-600">Loading order items...</p>
          ) : orderItems.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  Payment Method: {order.payment_method}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Payment Status: {order.payment_status}
                </p>
              </div>
              <h5 className="font-semibold text-gray-800 mb-3">Order Items:</h5>
              {orderItems.map((item) => (
                <div
                  key={item.order_item_id}
                  className="flex items-center mb-4 p-3 bg-gray-50 rounded"
                >
                  <img
                    src={
                      item.productVariant?.base_variant_image_url ||
                      "https://via.placeholder.com/80"
                    }
                    alt="Product"
                    className="w-16 h-16 rounded mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {item.product?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.productVariant?.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      Quantity: {item.total_quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      Price: ₹{item.price_at_time}
                    </div>
                    <div className="text-sm text-gray-700 font-semibold">
                      Total: ₹{item.final_price}
                    </div>
                    {item.discount_applied > 0 && (
                      <div className="text-sm text-green-600">
                        Discount: ₹{item.discount_applied}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Payment Method: {order.payment_method}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Payment Status: {order.payment_status}
              </p>
              {order.notes && (
                <p className="text-sm text-gray-600">Notes: {order.notes}</p>
              )}
            </div>
          )}
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          const response = await getApiById(orderRoute, userId);
          if (response.success) {
            setOrders(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      !Object.values(orderStatusFilters).some(Boolean) ||
      (orderStatusFilters.delivered && order.order_status === "delivered") ||
      (orderStatusFilters.cancelled && order.order_status === "cancelled") ||
      (orderStatusFilters.onTheWay && order.order_status === "pending") ||
      (orderStatusFilters.returned && order.order_status === "returned");

    const orderDate = new Date(order.order_date);
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
      ? order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
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
          {loading ? (
            <p className="text-sm text-gray-600">Loading orders...</p>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                expanded={expandedOrderId === order.order_id}
                onExpand={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.order_id ? null : order.order_id
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
