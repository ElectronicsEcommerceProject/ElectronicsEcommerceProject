import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "ag-grid-community";

import { allUserRoute, getApi } from "../../../src/index.js";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState({ customers: 0, retailers: 0 });
  const totalOrders = { all: 500, pending: 120, delivered: 350, cancelled: 30 };
  const totalRevenue = 245000;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getApi(allUserRoute);
        if (response && response.success && Array.isArray(response.users)) {
          const calculatedTotalUsers = response.users.reduce(
            (acc, user) => {
              if (user.role === "customer") {
                acc.customers += 1;
              } else if (user.role === "retailer") {
                acc.retailers += 1;
              }
              return acc;
            },
            { customers: 0, retailers: 0 }
          );
          setTotalUsers(calculatedTotalUsers);
          console.log("Calculated total users:", calculatedTotalUsers);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
          className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${
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
          className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${
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
    <div className="p-2 sm:p-4">
      <style>{`
        .gradient-border {
          position: relative;
          border-radius: 0.5rem;
          background-clip: padding-box;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(to right, #facc15, #3b82f6);
          border-radius: 0.5rem;
          padding: 2px;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }
        .ag-grid-mobile {
          height: auto !important;
          max-height: none !important;
        }
        .ag-grid-mobile .ag-root-wrapper {
          height: auto !important;
        }
        .ag-grid-mobile .ag-center-cols-viewport {
          overflow: visible !important;
        }
        .ag-grid-mobile .ag-center-cols-container {
          height: auto !important;
        }
        .ag-grid-mobile .ag-row {
          height: auto !important;
          min-height: 50px !important;
        }
        @media (max-width: 640px) {
          .ag-header-cell-label {
            justify-content: center;
            text-align: center;
          }
          .ag-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Total Users
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Customers</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {totalUsers.customers}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Retailers</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {totalUsers.retailers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Total Orders
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">All</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {totalOrders.all}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {totalOrders.pending}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Delivered</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {totalOrders.delivered}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Cancelled</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {totalOrders.cancelled}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Total Revenue
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5">
        {/* Low Stock Alerts */}
        <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Low Stock Alerts
            </h2>
            {lowStockAlerts.length > 0 ? (
              <ul className="space-y-2">
                {lowStockAlerts.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between text-gray-700 text-sm sm:text-base"
                  >
                    <span>{item.name}</span>
                    <span className="text-red-600 font-semibold">
                      {item.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                No low stock alerts.
              </p>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Top Selling Products
            </h2>
            <ul className="space-y-2">
              {topSellingProducts.map((product, index) => (
                <li
                  key={index}
                  className="flex justify-between text-gray-700 text-sm sm:text-base"
                >
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.sales} sold</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <button className="w-full bg-blue-600 text-white py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-[1.02] duration-300 shadow-sm text-sm sm:text-base">
                Add Product
              </button>
              <button className="w-full bg-blue-600 text-white py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-[1.02] duration-300 shadow-sm text-sm sm:text-base">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="gradient-border bg-white p-3 sm:p-4 rounded-lg shadow-md mt-4 sm:mt-5 hover:shadow-lg transition-shadow duration-300">
        <div className="relative z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
            Latest Orders
          </h2>
          <div className="space-y-0">
            {/* Customer Orders */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                Customer Orders
              </h3>
              {customerOrders.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base pb-2">
                  No customer orders found.
                </p>
              ) : (
                <div
                  className="ag-theme-alpine ag-grid-mobile w-full"
                  style={{ height: "auto" }}
                >
                  <AgGridReact
                    modules={[ClientSideRowModelModule]}
                    rowData={customerOrders}
                    columnDefs={customerColumnDefs}
                    defaultColDef={defaultColDef}
                    headerHeight={50}
                    rowHeight={50}
                    suppressCellFocus={true}
                    domLayout="autoHeight"
                  />
                </div>
              )}
            </div>

            {/* Retailer Orders */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2 pt-2">
                Retailer Orders
              </h3>
              {retailerOrders.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">
                  No retailer orders found.
                </p>
              ) : (
                <div
                  className="ag-theme-alpine ag-grid-mobile w-full"
                  style={{ height: "auto" }}
                >
                  <AgGridReact
                    modules={[ClientSideRowModelModule]}
                    rowData={retailerOrders}
                    columnDefs={retailerColumnDefs}
                    defaultColDef={defaultColDef}
                    headerHeight={50}
                    rowHeight={50}
                    suppressCellFocus={true}
                    domLayout="autoHeight"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
