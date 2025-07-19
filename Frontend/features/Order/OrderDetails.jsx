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
            Order Date: {new Date(order.order_date).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
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

const SearchBar = ({ searchInput, setSearchInput }) => (
  <div className="w-full mb-4">
    <div className="relative max-w-md">
      <input
        type="text"
        placeholder="🔍 Search orders (auto-search after 1.5s)..."
        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {searchInput && (
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
    {searchInput && (
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">Searching for:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
            "{searchInput}"
          </span>
        </div>
      </div>
    )}
  </div>
);



const OrderDetails = () => {
  const [searchInput, setSearchInput] = useState("");
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
      ...timeFilters,
      startDate: customDateRange.startDate,
      endDate: customDateRange.endDate
    });
    
    const url = `${orderRoute}/${userId}?${params.toString()}`;
    const response = await getApi(url);
    
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
  } = usePagination(fetchOrdersAPI, { limit: PAGINATION_CONFIG.DEFAULT_LIMIT });

  // Debounced search: Wait 1.5 seconds after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("🔍 Debounced search triggered:", searchInput);
      fetchOrders(1, false, searchInput, orderStatusFilters, orderTimeFilters, dateRange);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timeoutId);
  }, [searchInput, orderStatusFilters, orderTimeFilters, dateRange]);

  const handleOrderUpdate = () => {
    fetchOrders(1, false, searchInput, orderStatusFilters, orderTimeFilters, dateRange);
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
            searchInput={searchInput}
            setSearchInput={setSearchInput}
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
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {searchInput 
                    ? `No orders found for "${searchInput}"`
                    : "No orders found"
                  }
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {searchInput
                    ? "Try adjusting your search terms or clearing filters to find your orders."
                    : "It looks like you haven't placed any orders yet, or they don't match your current filters."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setOrderStatusFilters({
                        pending: false,
                        processing: false,
                        shipped: false,
                        delivered: false,
                        cancelled: false,
                        returned: false,
                      });
                      setOrderTimeFilters({
                        last30Days: false,
                        year2024: false,
                        year2023: false,
                        year2022: false,
                        year2021: false,
                        older: false,
                      });
                      setDateRange({ startDate: '', endDate: '' });
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Reset All Filters
                  </button>
                </div>
                <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>MAA LAXMI STORE</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Secure Orders</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
