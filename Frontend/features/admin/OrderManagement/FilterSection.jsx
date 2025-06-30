import React from "react";
import { Search } from "lucide-react"; // search icon ke liye

const FiltersSection = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  handleDateRangeChange,
  exportOrders,
  userType,
  setUserType,
}) => (
  <div className="bg-white p-4 rounded-md shadow-sm mb-6">
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input with Icon */}
      <div className="relative flex items-center w-[300px]">
        {/* <Search className="absolute left-5 text-gray-400" size={18} /> */}
        <input
          type="text"
          placeholder="Search orders By Email or Order ID "
          className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Status Dropdown */}
      <select
        className="w-[150px] px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Status</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Returned">Returned</option>
      </select>

      {/* Date Range Start */}
      <div className="flex flex-col">
        <input
          type="date"
          className="w-[150px] px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={dateRange.start}
          onChange={(e) =>
            handleDateRangeChange
              ? handleDateRangeChange("start", e.target.value)
              : setDateRange({ ...dateRange, start: e.target.value })
          }
          title="Select start date for filtering orders"
        />
      </div>

      {/* Date Range End */}
      <div className="flex flex-col">
        <input
          type="date"
          className="w-[150px] px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={dateRange.end}
          min={dateRange.start || undefined}
          onChange={(e) =>
            handleDateRangeChange
              ? handleDateRangeChange("end", e.target.value)
              : setDateRange({ ...dateRange, end: e.target.value })
          }
          title={
            dateRange.start
              ? `Select end date (must be on or after ${dateRange.start})`
              : "Select end date for filtering orders"
          }
          disabled={!dateRange.start}
        />
      </div>

      {/* Clear Date Range Button */}
      {(dateRange.start || dateRange.end) && (
        <button
          onClick={() => setDateRange({ start: "", end: "" })}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Clear date range filter"
        >
          Clear Dates
        </button>
      )}

      {/* User Type Dropdown */}
      <select
        className="w-[150px] px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
      >
        <option value="">User Type</option>
        <option value="Customer">Customer</option>
        <option value="Retailer">Retailer</option>
      </select>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => exportOrders("CSV")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-md text-sm"
        >
          Export CSV
        </button>

        <button
          onClick={() => exportOrders("PDF")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-md text-sm"
        >
          Export PDF
        </button>
      </div>
    </div>
  </div>
);

export default FiltersSection;
