import React from "react";

const OrderDetailModal = ({
  showModal,
  setShowModal,
  selectedOrder,
  setSelectedOrder,
  updateOrderStatus,
  handleRefund,
}) =>
  showModal &&
  selectedOrder && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[95%] max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            Order Details - {selectedOrder.id}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowModal(false)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Customer Information
            </h3>
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
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Order Items
            </h3>
            {selectedOrder.items &&
              selectedOrder.items.map((item, index) => (
                <p key={index} className="text-xs">
                  {item.name} x {item.qty} - ${item.price.toFixed(2)}
                </p>
              ))}
            <p className="font-semibold mt-1 text-sm">
              Total: ${selectedOrder.amount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Order Status
          </h3>
          <div className="flex items-center space-x-2">
            <select
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedOrder.status.toLowerCase()} // Convert to lowercase to match option values
              onChange={(e) =>
                updateOrderStatus(selectedOrder.orderId, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
        {selectedOrder.refundStatus && (
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Return/Refund Management
            </h3>
            <p className="text-sm">
              <strong>Status:</strong> {selectedOrder.refundStatus}
            </p>
            {selectedOrder.refundStatus === "Pending" && (
              <div className="flex space-x-2 mt-1">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition text-sm"
                  onClick={() => handleRefund(selectedOrder.orderId, "Approve")}
                >
                  Approve Refund
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition text-sm"
                  onClick={() => handleRefund(selectedOrder.orderId, "Deny")}
                >
                  Deny Refund
                </button>
              </div>
            )}
          </div>
        )}
        <div className="mt-3 flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition text-sm"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-sm"
            onClick={() => setShowModal(false)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

export default OrderDetailModal;
