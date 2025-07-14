import React, { useState, useEffect, useCallback } from "react";
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
import { usePagination, LoadMoreButton, LoadingSpinner, buildQueryParams, PAGINATION_CONFIG } from "../../src/utils/index.js";

const FilterSidebar = ({
  orderStatusFilters,
  setOrderStatusFilters,
  orderTimeFilters,
  setOrderTimeFilters,
  dateRange,
  setDateRange,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const statusOptions = [
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
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
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2 hover:text-blue-600 transition-colors text-left"
        >
          ORDER STATUS
          <svg className={`w-4 h-4 transform transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isStatusOpen && (
          <div className="mb-3">
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
        )}
      </div>
      <div>
        <button
          onClick={() => setIsTimeOpen(!isTimeOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2 hover:text-blue-600 transition-colors text-left"
        >
          ORDER TIME
          <svg className={`w-4 h-4 transform transition-transform ${isTimeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isTimeOpen && (
          <div className="mb-3">
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
        )}
      </div>
      
      {/* Custom Date Range Picker */}
      <div className="mt-4">
        <button
          onClick={() => setIsDateOpen(!isDateOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2 hover:text-blue-600 transition-colors text-left"
        >
          CUSTOM DATE RANGE
          <svg className={`w-4 h-4 transform transition-transform ${isDateOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isDateOpen && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                min={dateRange.startDate}
                className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {dateRange.startDate && dateRange.endDate && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                📅 {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
              </div>
            )}
            <button
              onClick={() => setDateRange({ startDate: '', endDate: '' })}
              className="w-full text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Clear Date Range
            </button>
          </div>
        )}
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



const OrderDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilters, setOrderStatusFilters] = useState({
    pending: false,
    processing: false,
    shipped: false,
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
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // API call function for pagination
  const fetchOrdersAPI = useCallback(async (page, limit, searchQuery = '', statusFilters = {}, timeFilters = {}, customDateRange = {}) => {
    const userId = getUserIdFromToken();
    if (!userId) return { success: false, data: [], pagination: {} };
    
    const params = buildQueryParams({
      page,
      limit,
      search: searchQuery,
      ...statusFilters,
      ...timeFilters
    });
    
    const response = await getApiById(orderRoute, userId);
    
    if (response.success) {
      // Apply client-side filtering since backend might not support all filters
      let filteredData = response.data.filter((order) => {
        const statusMatch =
          !Object.values(statusFilters).some(Boolean) ||
          (statusFilters.pending && order.order_status === "pending") ||
          (statusFilters.processing && order.order_status === "processing") ||
          (statusFilters.shipped && order.order_status === "shipped") ||
          (statusFilters.delivered && order.order_status === "delivered") ||
          (statusFilters.cancelled && order.order_status === "cancelled") ||
          (statusFilters.returned && order.order_status === "returned");

        const orderDate = new Date(order.order_date);
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        // Custom date range filter
        const dateRangeMatch = (() => {
          if (customDateRange.startDate && customDateRange.endDate) {
            const startDate = new Date(customDateRange.startDate);
            const endDate = new Date(customDateRange.endDate);
            endDate.setHours(23, 59, 59, 999);
            return orderDate >= startDate && orderDate <= endDate;
          }
          return true;
        })();

        const timeMatch =
          !Object.values(timeFilters).some(Boolean) ||
          (timeFilters.last30Days && orderDate >= thirtyDaysAgo) ||
          (timeFilters.year2024 && orderDate.getFullYear() === 2024) ||
          (timeFilters.year2023 && orderDate.getFullYear() === 2023) ||
          (timeFilters.year2022 && orderDate.getFullYear() === 2022) ||
          (timeFilters.year2021 && orderDate.getFullYear() === 2021) ||
          (timeFilters.older && orderDate.getFullYear() < 2021);

        const searchMatch = searchQuery
          ? order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        return statusMatch && timeMatch && searchMatch && dateRangeMatch;
      });
      
      // Manual pagination
      const totalItems = filteredData.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit
        }
      };
    }
    
    return response;
  }, []);
  
  // Use pagination hook
  const {
    data: orders,
    loading,
    loadingMore,
    pagination,
    fetchData: fetchOrders,
    loadMore: loadMoreOrders,
    hasMore,
    remainingItems
  } = usePagination(fetchOrdersAPI, { limit: 5 });

  useEffect(() => {
    fetchOrders(1, false, searchQuery, orderStatusFilters, orderTimeFilters, dateRange);
  }, [searchQuery, orderStatusFilters, orderTimeFilters, dateRange]);

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  const handleOrderUpdate = () => {
    fetchOrders(1, false, searchQuery, orderStatusFilters, orderTimeFilters, dateRange);
  };

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
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
        <div className="w-full flex-1 p-4 pt-0">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          {loading ? (
            <LoadingSpinner text="Loading orders..." />
          ) : orders.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {orders.length} of {pagination?.totalItems || 0} orders
                </p>
              </div>
              {orders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  expanded={expandedOrderId === order.order_id}
                  onExpand={() =>
                    setExpandedOrderId(
                      expandedOrderId === order.order_id ? null : order.order_id
                    )
                  }
                  onOrderUpdate={handleOrderUpdate}
                />
              ))}
              <LoadMoreButton
                onClick={loadMoreOrders}
                loading={loadingMore}
                hasMore={hasMore}
                remainingItems={remainingItems}
                buttonText="Load More Orders"
                loadingText="Loading more orders..."
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
