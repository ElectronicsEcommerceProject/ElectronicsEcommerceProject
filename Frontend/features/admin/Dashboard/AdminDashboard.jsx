import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "ag-grid-community";

const Dashboard = () => {
  const totalUsers = { customers: 1200, retailers: 150 };
  const totalOrders = { all: 500, pending: 120, delivered: 350, cancelled: 30 };
  const totalRevenue = 245000;
  const lowStockAlerts = [
    { name: "Product A", stock: 5 },
    { name: "Product B", stock: 3 },
  ];
  const topSellingProducts = [
    { name: "Product X", sales: 200 },
    { name: "Product Y", sales: 180 },
    { name: "Product Z", sales: 150 },
  ];

  const customerOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      status: "Delivered",
      date: "2025-04-25",
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      status: "Pending",
      date: "2025-04-24",
    },
    {
      id: "ORD003",
      customer: "Mike Ross",
      status: "Cancelled",
      date: "2025-04-23",
    },
  ];
  const retailerOrders = [
    {
      id: "RET001",
      retailer: "Retail A",
      status: "Delivered",
      date: "2025-04-25",
    },
    {
      id: "RET002",
      retailer: "Retail B",
      status: "Pending",
      date: "2025-04-24",
    },
  ];

  const customerColumnDefs = [
    {
      headerName: "Order ID",
      field: "id",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: "Customer",
      field: "customer",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellRenderer: (params) => (
        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            params.value === "Delivered"
              ? "bg-green-100 text-green-700"
              : params.value === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    },
  ];

  const retailerColumnDefs = [
    {
      headerName: "Order ID",
      field: "id",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: "Retailer",
      field: "retailer",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellRenderer: (params) => (
        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            params.value === "Delivered"
              ? "bg-green-100 text-green-700"
              : params.value === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    },
  ];

  const defaultColDef = {
    resizable: true,
    suppressMovable: true,
  };

  return (
    <div>
      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Total Users */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Total Users
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-gray-600 text-base sm:text-lg">Customers</p>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                {totalUsers.customers}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-base sm:text-lg">Retailers</p>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                {totalUsers.retailers}
              </p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Total Orders
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-gray-600 text-base sm:text-lg">All</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {totalOrders.all}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-base sm:text-lg">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {totalOrders.pending}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-base sm:text-lg">Delivered</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {totalOrders.delivered}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-base sm:text-lg">Cancelled</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                {totalOrders.cancelled}
              </p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Total Revenue
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Secondary Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-10">
        {/* Low Stock Alerts */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Low Stock Alerts
          </h2>
          {lowStockAlerts.length > 0 ? (
            <ul className="space-y-4">
              {lowStockAlerts.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between text-gray-700 text-base sm:text-lg"
                >
                  <span>{item.name}</span>
                  <span className="text-red-600 font-semibold">
                    {item.stock} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-base sm:text-lg">
              No low stock alerts.
            </p>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Top Selling Products
          </h2>
          <ul className="space-y-4">
            {topSellingProducts.map((product, index) => (
              <li
                key={index}
                className="flex justify-between text-gray-700 text-base sm:text-lg"
              >
                <span>{product.name}</span>
                <span className="font-semibold">{product.sales} sold</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Action Buttons */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4 sm:space-y-5">
            <button className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 shadow-md">
              Add Product
            </button>
            <button className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 shadow-md">
              Create Coupon
            </button>
          </div>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 mt-6 sm:mt-10 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Latest Orders
        </h2>
        <div className="space-y-6 sm:space-y-8">
          {/* Customer Orders */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3 sm:mb-4">
              Customer Orders
            </h3>
            {customerOrders.length === 0 ? (
              <p className="text-gray-600 text-base sm:text-lg">
                No customer orders found.
              </p>
            ) : (
              <div className="ag-theme-alpine w-full h-[300px] overflow-auto">
                <AgGridReact
                  modules={[ClientSideRowModelModule]}
                  rowData={customerOrders}
                  columnDefs={customerColumnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={5}
                  domLayout="autoHeight"
                />
              </div>
            )}
          </div>

          {/* Retailer Orders */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-3 sm:mb-4">
              Retailer Orders
            </h3>
            {retailerOrders.length === 0 ? (
              <p className="text-gray-600 text-base sm:text-lg">
                No retailer orders found.
              </p>
            ) : (
              <div className="ag-theme-alpine w-full h-[300px] overflow-auto">
                <AgGridReact
                  modules={[ClientSideRowModelModule]}
                  rowData={retailerOrders}
                  columnDefs={retailerColumnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={5}
                  domLayout="autoHeight"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;