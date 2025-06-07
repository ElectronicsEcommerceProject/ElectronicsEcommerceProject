import React, { useState } from "react";

// Enhanced Filters Component with validation
const Filters = ({ onDateChange }) => {
  const [range, setRange] = useState("Month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [dateError, setDateError] = useState("");

  const handleRangeChange = (value) => {
    setRange(value);
    setDateError(""); // Clear any previous errors
    if (value !== "Custom") {
      onDateChange(value);
    }
  };

  const handleStartDateChange = (value) => {
    setCustomStart(value);
    setDateError("");

    // If end date is already selected and is before the new start date, clear it
    if (customEnd && new Date(value) > new Date(customEnd)) {
      setCustomEnd("");
      setDateError("End date must be after start date");
    }
  };

  const handleEndDateChange = (value) => {
    if (customStart && new Date(value) < new Date(customStart)) {
      setDateError("End date must be after start date");
      return;
    }
    setCustomEnd(value);
    setDateError("");
  };

  const handleCustomApply = () => {
    if (!customStart || !customEnd) {
      setDateError("Please select both start and end dates");
      return;
    }

    if (new Date(customStart) > new Date(customEnd)) {
      setDateError("End date must be after start date");
      return;
    }

    setDateError("");
    onDateChange({ start: customStart, end: customEnd });
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 space-y-4 lg:space-y-0 w-full">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
          <select
            className="p-2 border rounded-md text-sm w-full sm:w-auto min-w-0 flex-shrink"
            value={range}
            onChange={(e) => handleRangeChange(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Custom">Custom</option>
          </select>
          {range === "Custom" && (
            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="date"
                  className="p-2 border rounded-md text-sm w-full sm:w-auto min-w-0 flex-shrink"
                  value={customStart}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  className="p-2 border rounded-md text-sm w-full sm:w-auto min-w-0 flex-shrink"
                  value={customEnd}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  min={customStart} // Prevent selecting dates before start date
                  placeholder="End Date"
                />
                <button
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm whitespace-nowrap flex-shrink-0"
                  onClick={handleCustomApply}
                >
                  Apply
                </button>
              </div>
              {dateError && (
                <div className="text-red-500 text-xs mt-1">{dateError}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
