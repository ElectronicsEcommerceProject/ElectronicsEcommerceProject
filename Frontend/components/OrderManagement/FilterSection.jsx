import React from "react";

const FiltersSection = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  exportOrders,
  userType,
  setUserType,
}) => {
  // Handler for start date changes
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;

    // Update the start date
    setDateRange({
      ...dateRange,
      start: newStartDate,
      // If the end date is before the new start date, reset it
      end:
        dateRange.end && new Date(dateRange.end) < new Date(newStartDate)
          ? ""
          : dateRange.end,
    });
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-md shadow-sm mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search Input with Icon */}
        <div className="relative flex items-center w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-4 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className="w-full sm:w-auto sm:min-w-[120px] px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
        <input
          type="date"
          className="w-full sm:w-auto sm:min-w-[130px] px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={dateRange.start}
          onChange={handleStartDateChange}
        />

        {/* Date Range End */}
        <input
          type="date"
          className="w-full sm:w-auto sm:min-w-[130px] px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          min={dateRange.start || ""} // Set minimum date to start date if it exists
          disabled={!dateRange.start} // Disable end date selection if start date is not selected
        />

        {/* User Type Dropdown */}
        <select
          className="w-full sm:w-auto sm:min-w-[120px] px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="">All Users</option>
          <option value="customer">customer</option>
          <option value="retailer">retailer</option>
        </select>

        {/* Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
          <button
            onClick={() => exportOrders("CSV")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-md text-sm transition-colors"
          >
            Export CSV
          </button>

          <button
            onClick={() => exportOrders("PDF")}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-md text-sm transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
