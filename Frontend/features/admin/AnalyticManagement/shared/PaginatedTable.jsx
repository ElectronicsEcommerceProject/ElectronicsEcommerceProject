import React, { useState } from "react";

// Paginated Table Component
const PaginatedTable = ({
  data,
  headers,
  itemsPerPage,
  onRowClick,
  searchTerm,
  setSearchTerm,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full overflow-x-hidden">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border rounded-md mb-4 text-sm max-w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Desktop Table View */}
      <div className="hidden md:block max-h-72 overflow-y-auto overflow-x-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="p-2 sm:p-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer border-b"
                  onClick={() => onRowClick(item)}
                >
                  {Object.values(item)
                    .slice(0, headers.length)
                    .map((val, i) => (
                      <td
                        key={i}
                        className="p-2 sm:p-3 text-xs sm:text-sm break-words max-w-0"
                      >
                        <div className="truncate">{val}</div>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 max-h-72 overflow-y-auto w-full">
        {paginatedData.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-3 cursor-pointer hover:bg-gray-50 w-full min-w-0"
            onClick={() => onRowClick(item)}
          >
            {Object.values(item)
              .slice(0, headers.length)
              .map((val, i) => (
                <div key={i} className="flex justify-between py-1 min-w-0">
                  <span className="font-medium text-gray-600 text-xs flex-shrink-0">
                    {headers[i]}:
                  </span>
                  <span className="text-xs break-words text-right ml-2 min-w-0">
                    {val}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0 w-full">
        <button
          className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-xs sm:text-sm whitespace-nowrap">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50 text-xs sm:text-sm w-full sm:w-auto"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
