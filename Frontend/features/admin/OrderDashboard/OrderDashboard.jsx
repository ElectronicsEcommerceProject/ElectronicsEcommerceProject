import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { jsPDF } from "jspdf";

import {
  Header,
  FiltersSection,
  MetricsSection,
  OrdersTable,
  OrderDetailModal,
  ManualOrderModal,
  QuickActions,
  Notifications,
  CustomModal,
} from "../../../features/admin/index.js";

import {
  orderRoute,
  getApi,
  updateApiById,
  MESSAGE,
} from "../../../src/index.js";

// Fallback initial orders in case API fails
const initialOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    status: "Pending",
    amount: 150.0,
    date: "2025-04-25",
    items: [
      { name: "Product A", qty: 2, price: 50 },
      { name: "Product B", qty: 1, price: 50 },
    ],
    address: "123 Example St, City",
    tracking: null,
    refundStatus: null,
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    status: "Shipped",
    amount: 200.0,
    date: "2025-04-24",
    items: [{ name: "Product C", qty: 1, price: 200 }],
    address: "456 Sample Rd, City",
    tracking: { carrier: "FedEx", number: "123456" },
    refundStatus: null,
  },
  {
    id: "ORD003",
    customer: "Alice Brown",
    email: "alice@example.com",
    phone: "5555555555",
    status: "Delivered",
    amount: 300.0,
    date: "2025-04-23",
    items: [{ name: "Product D", qty: 3, price: 100 }],
    address: "789 Test Ave, City",
    tracking: { carrier: "UPS", number: "789012" },
    refundStatus: "Pending",
  },
];

const OrderDashboard = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [userType, setUserType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      message: "Low stock alert: Product A is running low.",
    },
    {
      id: 2,
      type: "error",
      message: "Pending return request for Order ORD003.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // State for CustomModal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    onConfirm: null,
    confirmText: "OK",
    cancelText: "Cancel",
  });

  // State for order metrics
  const [totalOrders, setTotalOrders] = useState({
    all: 0,
    pending: 0,
    shipped: 0,
    cancelled: 0,
  });

  // Function to show modal
  const showCustomModal = (config) => {
    setModalConfig({ ...config, isOpen: true });
  };

  // Function to close modal
  const closeCustomModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Fetch order data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ordersResponse = await getApi(orderRoute);
        if (
          ordersResponse &&
          ordersResponse.message === MESSAGE.get.succ &&
          Array.isArray(ordersResponse.data)
        ) {
          // Calculate metrics from API response
          const calculatedTotalOrders = ordersResponse.data.reduce(
            (acc, order) => {
              acc.all += 1;
              if (order.order_status === "pending") {
                acc.pending += 1;
              } else if (order.order_status === "shipped") {
                acc.shipped += 1;
              } else if (order.order_status === "cancelled") {
                acc.cancelled += 1;
              }
              return acc;
            },
            { all: 0, pending: 0, shipped: 0, cancelled: 0 }
          );

          // Update order metrics state
          setTotalOrders(calculatedTotalOrders);

          // Map API response to the format expected by OrdersTable
          const mappedOrders = ordersResponse.data.map((order) => {
            // Get total items count and calculate amount if not available
            const itemsCount = order.orderItems ? order.orderItems.length : 0;
            const calculatedAmount = parseFloat(order.total_amount || 0);

            // Extract customer name and email
            const customerName = order.user ? order.user.name : "Unknown";
            const customerEmail = order.user ? order.user.email : "No email";

            // Format the date
            const orderDate = new Date(order.order_date);
            const formattedDate = orderDate.toISOString().split("T")[0];

            // Map tracking information
            const tracking = order.tracking_number
              ? { carrier: "Carrier", number: order.tracking_number }
              : null;

            // Map the items array
            const items =
              order.orderItems && Array.isArray(order.orderItems)
                ? order.orderItems.map((item) => ({
                    name: item.product ? item.product.name : "Unknown Product",
                    qty: item.total_quantity || 1,
                    price: parseFloat(item.price_at_time || 0),
                  }))
                : [];

            // Format address
            const address = order.address
              ? `${order.address.address_line1}, ${order.address.city}, ${order.address.state}, ${order.address.postal_code}`
              : "Address not available";

            // Map the order object to match the format expected by the frontend
            return {
              id: order.order_number || `ORD-${order.order_id.substring(0, 8)}`,
              customer: customerName,
              email: customerEmail,
              phone: order.user.phone_number || "(Not available in API)",
              status: order.order_status, // Keep lowercase as received from API
              amount: calculatedAmount,
              date: formattedDate,
              items: items,
              address: address,
              tracking: tracking,
              refundStatus: null, // Not provided in API
              paymentStatus: order.payment_status,
              paymentMethod: order.payment_method,
              notes: order.notes,
              orderId: order.order_id, // Keep the original ID for reference
              role: order.user.role,
            };
          });

          setOrders(mappedOrders);
          setFilteredOrders(mappedOrders);
        } else {
          console.error("Invalid orders response format:", ordersResponse);
          // Keep the initial orders as fallback
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep the initial orders as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updateOrderStatus = await updateApiById(orderRoute, orderId, {
        order_status: newStatus,
      });

      if (updateOrderStatus.message === MESSAGE.put.succ) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        showCustomModal({
          title: "Success",
          message: `Order ${orderId} status updated to ${newStatus}.`,
          type: "alert",
          confirmText: "OK",
        });
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      showCustomModal({
        title: "Error",
        message: "Failed to update order status. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone?.includes(searchQuery)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate >= new Date(dateRange.start) &&
          orderDate <= new Date(dateRange.end)
        );
      });
    }
    // User type filtering
    if (userType) {
      console.log("Selected User Type:", userType);
      filtered = filtered.filter((order) => {
        // Make sure we have the user object with role property
        if (!order.role) {
          // console.log("testing", order);
          return false;
        }

        if (userType === "admin") {
          return true; // Admin can see all orders
        } else if (userType === "retailer") {
          return order.role === "retailer";
        } else if (userType === "customer") {
          return order.role === "customer";
        }
        return false;
      });
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateRange, orders, userType]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add tracking information
  const addTracking = (orderId, carrier, trackingNumber) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, tracking: { carrier, number: trackingNumber } }
          : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        tracking: { carrier, number: trackingNumber },
      });
    }
  };

  // Handle refund/return
  const handleRefund = (orderId, action) => {
    showCustomModal({
      title: "Confirm Refund Action",
      message: `Are you sure you want to ${action} the refund for order ${orderId}?`,
      type: "confirm",
      onConfirm: () => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  refundStatus: action === "Approve" ? "Approved" : "Denied",
                }
              : order
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            refundStatus: action === "Approve" ? "Approved" : "Denied",
          });
        }
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: `Refund ${action.toLowerCase()}d for Order ${orderId}.`,
          },
        ]);
        showCustomModal({
          title: "Success",
          message: `Refund ${action.toLowerCase()}d for Order ${orderId}.`,
          type: "alert",
          confirmText: "OK",
        });
      },
      confirmText: action,
    });
  };

  // Export orders
  const exportOrders = (format) => {
    if (format === "CSV") {
      const csvContent = [
        ["Order ID", "Customer", "Email", "Status", "Total", "Date"],
        ...filteredOrders.map((order) => [
          order.id,
          order.customer,
          order.email,
          order.status,
          order.amount,
          order.date,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === "PDF") {
      const doc = new jsPDF();
      doc.text("Orders Report", 10, 10);
      filteredOrders.forEach((order, index) => {
        doc.text(
          `${order.id} | ${order.customer} | ${order.status} | $${order.amount} | ${order.date}`,
          10,
          20 + index * 10
        );
      });
      doc.save("orders.pdf");
    }
  };

  // Download invoice
  const downloadInvoice = useCallback((order) => {
    try {
      if (!order || !order.id || !order.items) {
        showCustomModal({
          title: "Error",
          message: "Invalid order data. Cannot generate invoice.",
          type: "alert",
          confirmText: "OK",
        });
        return;
      }
      const doc = new jsPDF();
      doc.text(`Invoice for Order ${order.id}`, 10, 10);
      doc.text(`Customer: ${order.customer || "N/A"}`, 10, 20);
      doc.text(`Email: ${order.email || "N/A"}`, 10, 30);
      doc.text(`Date: ${order.date || "N/A"}`, 10, 40);
      doc.text("Items:", 10, 50);
      order.items.forEach((item, index) => {
        doc.text(
          `${item.name || "Unknown"} x ${item.qty || 0} - $${item.price || 0}`,
          10,
          60 + index * 10
        );
      });
      doc.text(
        `Total: $${order.amount || 0}`,
        10,
        60 + order.items.length * 10
      );
      doc.save(`invoice_${order.id}.pdf`);
      showCustomModal({
        title: "Success",
        message: `Invoice for Order ${order.id} downloaded successfully.`,
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      showCustomModal({
        title: "Error",
        message: "Failed to generate invoice. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  }, []);

  // Create manual order
  const createOrder = (newOrder) => {
    const orderId = `ORD${(orders.length + 1).toString().padStart(3, "0")}`;
    setOrders((prevOrders) => [
      ...prevOrders,
      {
        id: orderId,
        customer: newOrder.customer,
        email: newOrder.email,
        phone: newOrder.phone,
        status: "Pending",
        amount: newOrder.items.reduce(
          (sum, item) => sum + item.qty * item.price,
          0
        ),
        date: new Date().toISOString().split("T")[0],
        items: newOrder.items,
        address: newOrder.address,
        tracking: null,
        refundStatus: null,
        role: newOrder.user.role,
      },
    ]);
    setShowCreateOrderModal(false);
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "success",
        message: `Order ${orderId} created successfully.`,
      },
    ]);
  };

  // Dismiss notification
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Call Header Component */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Call FiltersSection Component */}
        <FiltersSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          exportOrders={exportOrders}
          userType={userType}
          setUserType={setUserType}
        />

        {/* Call MetricsSection Component with the total orders data */}
        <MetricsSection totalOrders={totalOrders} />

        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Call OrdersTable Component with the API data */
          <OrdersTable
            currentOrders={currentOrders}
            setSelectedOrder={setSelectedOrder}
            setShowModal={setShowModal}
            updateOrderStatus={updateOrderStatus}
            downloadInvoice={downloadInvoice}
            ordersPerPage={ordersPerPage}
            setOrdersPerPage={setOrdersPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </main>

      {/* Call OrderDetailModal Component */}
      <OrderDetailModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        updateOrderStatus={updateOrderStatus}
        addTracking={addTracking}
        handleRefund={handleRefund}
        downloadInvoice={downloadInvoice}
      />

      {/* Call ManualOrderModal Component */}
      <ManualOrderModal
        showCreateOrderModal={showCreateOrderModal}
        setShowCreateOrderModal={setShowCreateOrderModal}
        createOrder={createOrder}
      />

      {/* Call QuickActions Component */}
      <QuickActions setShowCreateOrderModal={setShowCreateOrderModal} />

      {/* Call Notifications Component */}
      <Notifications
        notifications={notifications}
        dismissNotification={dismissNotification}
      />

      {/* Call CustomModal Component */}
      <CustomModal
        isOpen={modalConfig.isOpen}
        onClose={closeCustomModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </div>
  );
};

export default OrderDashboard;
