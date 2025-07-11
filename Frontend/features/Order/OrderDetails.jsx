import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getApi,
  orderRoute,
  getApiById,
  getUserIdFromToken,
  orderItemByOrderIdRoute,
  cancelOrderRoute,
  updateApiById,
  orderItemRoute,
  deleteApiById,
} from "../../src/index.js";

import { Footer, Header } from "../../components/index.js";

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

const OrderCard = ({ order, expanded, onExpand, onOrderUpdate }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                order.order_status === "pending"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : order.order_status === "processing"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : order.order_status === "delivered"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : order.order_status === "cancelled"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : order.order_status === "returned"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {order.order_status}
            </span>
          </div>
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
                  className="flex flex-col sm:flex-row items-start sm:items-center mb-4 p-3 bg-gray-50 rounded"
                >
                  <img
                    src={
                      item.productVariant?.base_variant_image_url ||
                      "https://via.placeholder.com/80"
                    }
                    alt="Product"
                    className="w-16 h-16 rounded mr-0 sm:mr-4 mb-3 sm:mb-0 object-cover"
                  />
                  <div className="flex-1 w-full">
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
                    {(order.order_status === "pending" ||
                      order.order_status === "processing") && (
                      <div className="mt-2">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Are you sure you want to cancel this item?\n\nProduct: ${item.product?.name}\nVariant: ${item.productVariant?.description || "N/A"}\nQuantity: ${item.total_quantity}\nOriginal Price: ₹${item.price_at_time}${item.discount_applied > 0 ? `\nDiscount: ₹${item.discount_applied}` : ''}\nFinal Price: ₹${item.final_price}${item.discount_applied > 0 ? '\n\n⚠️ You will lose the discount on this item!' : ''}`
                              )
                            ) {
                              try {
                                const response = await deleteApiById(
                                  orderItemRoute,
                                  item.order_item_id
                                );
                                if (response && response.success !== false) {
                                  alert("Order item cancelled successfully!");
                                  // Remove item from local state instead of API call
                                  setOrderItems(prev => prev.filter(i => i.order_item_id !== item.order_item_id));
                                } else {
                                  alert(
                                    response?.message ||
                                      "Failed to cancel order item. Please try again."
                                  );
                                }
                              } catch (error) {
                                console.error("Error cancelling order item:", error);
                                alert("Failed to cancel order item. Please try again.");
                              }
                            }
                          }}
                          className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                        >
                          Cancel Item
                        </button>
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
          {/* Cancel Order Button */}
          {(order.order_status === "pending" ||
            order.order_status === "processing") && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "Are you sure you want to cancel this order?"
                    )
                  ) {
                    setCancelling(true);
                    try {
                      const response = await updateApiById(
                        cancelOrderRoute,
                        order.order_id
                      );
                      if (response && response.success) {
                        alert("Order cancelled successfully!");
                        onOrderUpdate();
                      } else {
                        alert(
                          response?.message ||
                            "Failed to cancel order. Please try again."
                        );
                      }
                    } catch (error) {
                      console.error("Error cancelling order:", error);
                      alert("Failed to cancel order. Please try again.");
                    } finally {
                      setCancelling(false);
                    }
                  }
                }}
                disabled={cancelling}
                className={`px-4 py-2 rounded transition-colors ${
                  cancelling
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {cancelling ? "Cancelling..." : "Cancel Complete Order"}
              </button>
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
        }`}
      >
        ← Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
        }`}
      >
        Next →
      </button>
    </div>
  );
};

const OrderDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
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

  useEffect(() => {
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedOrderId(null); // Close any expanded order when changing pages
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [orderStatusFilters, orderTimeFilters, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
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
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstOrder + 1}-
                  {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                  {filteredOrders.length} orders
                </p>
              </div>
              {currentOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  expanded={expandedOrderId === order.order_id}
                  onExpand={() =>
                    setExpandedOrderId(
                      expandedOrderId === order.order_id ? null : order.order_id
                    )
                  }
                  onOrderUpdate={fetchOrders}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
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
