import React from "react";
import { updateApiById, orderRoute, cancelOrderRoute, MESSAGE } from "../../../src/index.js";

const OrderDetailModal = ({
  showModal,
  setShowModal,
  selectedOrder,
  setSelectedOrder,
  onOrderStatusUpdate,
}) => {
  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await updateApiById(orderRoute, orderId, {
        order_status: newStatus,
      });

      if (response?.success) {
        // Update the selected order status in the modal
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        
        // Update the dashboard orders list
        if (onOrderStatusUpdate) {
          onOrderStatusUpdate(orderId, newStatus);
          onOrderStatusUpdate(selectedOrder.id, newStatus);
        }
        
        alert(response?.message || `Order status updated to ${newStatus} successfully!`);
      } else {
        alert(response?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // Check if error has response data (API error)
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to update order status");
      } else if (error.message) {
        alert(error.message);
      } else {
        alert("Failed to update order status. Please try again.");
      }
    }
  };

  const handleRefund = async (orderId, action) => {
    try {
      alert(`Refund ${action.toLowerCase()}ed for Order ${orderId}`);
      
      // Update the refund status in the modal
      const newRefundStatus = action === "Approve" ? "Approved" : "Denied";
      setSelectedOrder(prev => ({ ...prev, refundStatus: newRefundStatus }));
    } catch (error) {
      console.error("Error handling refund:", error);
      alert("Failed to process refund. Please try again.");
    }
  };

  if (!showModal || !selectedOrder) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Order Details - {selectedOrder.id}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => setShowModal(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              Customer Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Name:</strong> {selectedOrder.customer}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p className="text-sm">
                <strong>Address:</strong> {selectedOrder.address}
              </p>
              {(selectedOrder.latitude || selectedOrder.longitude) && (
                <div className="text-sm mt-2">
                  <strong>Coordinates:</strong>
                  <div className="ml-2 text-xs text-gray-600">
                    <div>Latitude: {selectedOrder.latitude || 'N/A'}</div>
                    <div>Longitude: {selectedOrder.longitude || 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              Order Items
            </h3>
            <div className="space-y-1">
              {selectedOrder.items &&
                selectedOrder.items.map((item, index) => (
                  <p key={index} className="text-sm">
                    {item.name} x {item.qty} - ₹{item.price.toFixed(2)}
                  </p>
                ))}
            </div>
            <p className="font-semibold mt-3 text-sm border-t pt-2">
              Total: ₹{selectedOrder.amount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
            Order Status
          </h3>
          <div className="flex items-center space-x-2">
            <select
              className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              value={selectedOrder.status.toLowerCase()} // Convert to lowercase to match option values
              onChange={(e) =>
                updateOrderStatus(selectedOrder.orderId, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
        {selectedOrder.refundStatus && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              Return/Refund Management
            </h3>
            <p className="text-sm mb-3">
              <strong>Status:</strong> {selectedOrder.refundStatus}
            </p>
            {selectedOrder.refundStatus === "Pending" && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                  onClick={() => handleRefund(selectedOrder.orderId, "Approve")}
                >
                  Approve Refund
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
                  onClick={() => handleRefund(selectedOrder.orderId, "Deny")}
                >
                  Deny Refund
                </button>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition text-sm font-medium order-2 sm:order-1"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium order-1 sm:order-2"
            onClick={() => setShowModal(false)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
