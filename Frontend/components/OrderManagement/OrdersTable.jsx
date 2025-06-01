import React from "react";

const OrdersTable = ({
  currentOrders,
  setSelectedOrder,
  setShowModal,
  updateOrderStatus,
  ordersPerPage,
  setOrdersPerPage,
  currentPage,
  totalPages,
  paginate,
}) => (
  <div className="overflow-hidden">
    {/* Desktop Table View */}
    <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Order ID", "Customer", "Status", "Total", "Date", "Actions"].map(
              (header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    {order.id}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div>
                    <div className="text-blue-600 hover:underline">
                      {order.customer}
                    </div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Pending" || order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped" ||
                          order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Delivered" ||
                          order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Cancelled" ||
                          order.status === "cancelled" ||
                          order.status === "Returned" ||
                          order.status === "returned"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status || "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  ₹
                  {typeof order.amount === "number"
                    ? order.amount.toFixed(2)
                    : parseFloat(order.amount || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {order.date || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>
                    <select
                      className="border rounded p-1 text-xs text-blue-600"
                      value={order.status.toLowerCase()} // Convert to lowercase to match option values
                      onChange={(e) =>
                        updateOrderStatus(order.orderId, e.target.value)
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                      <option value="returned">returned</option>
                    </select>
                    <button
                      className="text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded"
                      onClick={() =>
                        updateOrderStatus(order.orderId, "cancelled")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-3">
      {currentOrders.length > 0 ? (
        currentOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <button
                className="text-blue-600 hover:underline font-medium text-sm"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                {order.id}
              </button>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "Pending" || order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "Shipped" || order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Delivered" ||
                      order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Cancelled" ||
                      order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status || "Unknown"}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">
                  ₹
                  {typeof order.amount === "number"
                    ? order.amount.toFixed(2)
                    : parseFloat(order.amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{order.date || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded text-xs font-medium"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                View Details
              </button>
              <select
                className="text-xs border rounded px-2 py-1 bg-white"
                value={order.status ? order.status.toLowerCase() : ""}
                onChange={(e) =>
                  updateOrderStatus(order.orderId, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No orders found
        </div>
      )}
    </div>

    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        <label className="text-sm text-gray-700">Show</label>
        <select
          className="border rounded p-1 text-sm"
          value={ordersPerPage}
          onChange={(e) => setOrdersPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-700">per page</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default OrdersTable;
