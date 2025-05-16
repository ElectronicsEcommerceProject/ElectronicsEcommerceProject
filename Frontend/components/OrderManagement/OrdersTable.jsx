import React from "react";

const OrdersTable = ({
  currentOrders,
  setSelectedOrder,
  setShowModal,
  updateOrderStatus,
  downloadInvoice,
  ordersPerPage,
  setOrdersPerPage,
  currentPage,
  totalPages,
  paginate,
}) => (
  <div>
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Order ID", "Customer", "Status", "Total", "Date", "Actions"].map(
              (header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-blue-600 hover:underline">
                      {order.customer}
                    </div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  $
                  {typeof order.amount === "number"
                    ? order.amount.toFixed(2)
                    : parseFloat(order.amount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.date || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 px-2 py-1"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    View
                  </button>
                  <select
                    className="border rounded p-1 text-sm text-blue-600"
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="Pending" className="py-1">
                      Pending
                    </option>
                    <option value="Shipped" className="py-1">
                      Shipped
                    </option>
                    <option value="Delivered" className="py-1">
                      Delivered
                    </option>
                    <option value="Cancelled" className="py-1">
                      Cancel
                    </option>
                    <option value="Returned" className="py-1">
                      Returned
                    </option>
                  </select>
                  <button
                    className="text-green-600 hover:text-green-800 px-2 py-1"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    Tracking
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 px-2 py-1"
                    onClick={() => updateOrderStatus(order.id, "Cancelled")}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 px-2 py-1"
                    onClick={() => downloadInvoice(order)}
                    disabled={!order.items || order.items.length === 0}
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
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
      <div className="flex space-x-2">
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
