import React, { useState, useEffect, useMemo } from "react";
import { FiClock, FiCheckCircle, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiPackage, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStore, FaIdCard } from "react-icons/fa";

/**
 * RetailerApprovalManager Component
 * 
 * This component manages the approval process for new retailer accounts.
 * It displays a list of pending retailers and provides actions to approve, reject, or ban them.
 */
const RetailerApprovalManager = ({ pendingRetailers: propRetailers }) => {
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [pendingRetailers, setPendingRetailers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  
  // Will use data from API instead of hardcoded data
  
  // Initialize with provided retailers from props
  useEffect(() => {
    if (propRetailers && propRetailers.length > 0) {
      setPendingRetailers(propRetailers);
    }
  }, [propRetailers]);
  
  // Search and filter retailers
  const searchedAndFilteredRetailers = useMemo(() => {
    // First filter by status
    const statusFiltered = filterStatus === 'all' 
      ? pendingRetailers 
      : pendingRetailers.filter(retailer => retailer.status === filterStatus);
    
    // Then filter by search query
    if (!searchQuery) return statusFiltered;
    
    const query = searchQuery.toLowerCase();
    return statusFiltered.filter(retailer => 
      retailer.name.toLowerCase().includes(query) ||
      retailer.email.toLowerCase().includes(query) ||
      retailer.phone.toLowerCase().includes(query) ||
      (retailer.address && retailer.address.toLowerCase().includes(query))
    );
  }, [pendingRetailers, filterStatus, searchQuery]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Update total pages when filtered results change
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(searchedAndFilteredRetailers.length / itemsPerPage)));
    // Reset to first page when filters or search changes
    if (currentPage > 1 && indexOfFirstItem >= searchedAndFilteredRetailers.length) {
      setCurrentPage(1);
    }
  }, [searchedAndFilteredRetailers.length, itemsPerPage, currentPage, indexOfFirstItem]);
  
  // Get current items for the page
  const currentRetailers = searchedAndFilteredRetailers.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleApprove = (retailerId) => {
    // API call to approve retailer would go here
    alert(`Retailer ${retailerId} approved successfully!`);
  };

  const handleReject = (retailerId) => {
    // API call to reject retailer would go here
    alert(`Retailer ${retailerId} rejected.`);
  };

  const handleBan = (retailerId) => {
    // API call to ban retailer would go here
    if (window.confirm('Are you sure you want to ban this retailer?')) {
      alert(`Retailer ${retailerId} banned.`);
    }
  };
  
  const handleStatusChange = (retailerId, currentStatus, newStatus, notes = '') => {
    // API call to change retailer status would go here
    if (newStatus === 'banned' && !window.confirm('Are you sure you want to ban this retailer?')) {
      return false;
    }
    
    // Here you would make the actual API call
    alert(`Retailer ${retailerId} status changed from ${currentStatus} to ${newStatus}${notes ? ' with notes' : ''}`);
    
    // Update local state (in a real app, you'd update after API success)
    setPendingRetailers(prevRetailers => 
      prevRetailers.map(retailer => 
        retailer.id === retailerId ? {...retailer, status: newStatus} : retailer
      )
    );
    
    return true;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <FiClock className="mr-2 text-yellow-500" /> Retailer Approval Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage new retailer account requests</p>
      </div>
      
      {/* Search Box and Items Per Page */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search retailers by name, email, or phone..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
          <select
            id="itemsPerPage"
            className="p-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      {/* Stats Cards - Clickable for filtering */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <button 
          onClick={() => setFilterStatus('all')}
          className={`p-3 rounded-lg text-left transition-all ${filterStatus === 'all' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-blue-50 hover:bg-blue-100'}`}
        >
          <div className="text-blue-600 text-sm font-medium">Total Requests</div>
          <div className="text-2xl font-bold">{pendingRetailers.length}</div>
        </button>
        
        <button 
          onClick={() => setFilterStatus('inactive')}
          className={`p-3 rounded-lg text-left transition-all ${filterStatus === 'inactive' ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-yellow-50 hover:bg-yellow-100'}`}
        >
          <div className="text-yellow-600 text-sm font-medium">Pending</div>
          <div className="text-2xl font-bold">{pendingRetailers.filter(r => r.status === 'inactive').length}</div>
        </button>
        
        <button 
          onClick={() => setFilterStatus('active')}
          className={`p-3 rounded-lg text-left transition-all ${filterStatus === 'active' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-green-50 hover:bg-green-100'}`}
        >
          <div className="text-green-600 text-sm font-medium">Approved</div>
          <div className="text-2xl font-bold">{pendingRetailers.filter(r => r.status === 'active').length}</div>
        </button>
        
        <button 
          onClick={() => setFilterStatus('rejected')}
          className={`p-3 rounded-lg text-left transition-all ${filterStatus === 'rejected' ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-orange-50 hover:bg-orange-100'}`}
        >
          <div className="text-orange-600 text-sm font-medium">Rejected</div>
          <div className="text-2xl font-bold">{pendingRetailers.filter(r => r.status === 'rejected').length}</div>
        </button>
        
        <button 
          onClick={() => setFilterStatus('banned')}
          className={`p-3 rounded-lg text-left transition-all ${filterStatus === 'banned' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-red-50 hover:bg-red-100'}`}
        >
          <div className="text-red-600 text-sm font-medium">Banned</div>
          <div className="text-2xl font-bold">{pendingRetailers.filter(r => r.status === 'banned').length}</div>
        </button>
      </div>
      
      {/* Results count and current filter */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>
          Showing {currentRetailers.length} of {searchedAndFilteredRetailers.length} retailers
          {filterStatus !== 'all' && ` (filtered by ${filterStatus})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>
      
      {currentRetailers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="bg-yellow-50 inline-block p-4 rounded-full mb-4">
            <FiCheckCircle className="text-yellow-500 w-12 h-12" />
          </div>
          <h3 className="text-xl font-medium text-gray-700">No retailers found</h3>
          <p className="text-gray-500 mt-2">
            {searchQuery 
              ? "Try adjusting your search query or filters" 
              : filterStatus !== 'all' 
                ? `No retailers with status "${filterStatus}" found` 
                : "All retailer accounts have been processed."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Retailer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRetailers.map((retailer) => (
                  <tr key={retailer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div 
                        className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors"
                        onClick={() => setSelectedRetailer(retailer)}
                        title="Click to view details"
                      >
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={retailer.profileImage_url || "https://via.placeholder.com/40"} 
                            alt={retailer.name} 
                          />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{retailer.name}</div>
                          <div className="text-xs text-gray-500">Joined {retailer.createdDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div 
                        className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors"
                        onClick={() => setSelectedRetailer(retailer)}
                        title="Click to view details"
                      >
                        <div className="flex items-center text-gray-900">
                          <FiMail className="mr-1 text-gray-400" /> {retailer.email}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <FiPhone className="mr-1 text-gray-400" /> {retailer.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer
                          ${retailer.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                            retailer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                            retailer.status === 'rejected' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                            'bg-red-100 text-red-800 hover:bg-red-200'}`}
                        onClick={() => setSelectedRetailer(retailer)}
                        title="Click to view details"
                      >
                        {retailer.status === 'active' ? 'Approved' : 
                         retailer.status === 'inactive' ? 'Pending' : 
                         retailer.status === 'rejected' ? 'Rejected' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {retailer.status === 'inactive' && (
                          <>
                            <button 
                              onClick={() => handleApprove(retailer.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(retailer.id)}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-xs"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleBan(retailer.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                            >
                              Ban
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setSelectedRetailer(retailer)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {currentRetailers.map((retailer) => (
              <div key={retailer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-colors"
                      onClick={() => setSelectedRetailer(retailer)}
                      title="Click to view details"
                    >
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={retailer.profileImage_url || "https://via.placeholder.com/40"} 
                        alt={retailer.name} 
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{retailer.name}</div>
                        <div className="text-xs text-gray-500">Joined {retailer.createdDate}</div>
                      </div>
                    </div>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer
                        ${retailer.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                          retailer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                          retailer.status === 'rejected' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                          'bg-red-100 text-red-800 hover:bg-red-200'}`}
                      onClick={() => setSelectedRetailer(retailer)}
                      title="Click to view details"
                    >
                      {retailer.status === 'active' ? 'Approved' : 
                       retailer.status === 'inactive' ? 'Pending' : 
                       retailer.status === 'rejected' ? 'Rejected' : 'Banned'}
                    </span>
                  </div>
                  
                  <div 
                    className="grid grid-cols-1 gap-2 text-sm mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
                    onClick={() => setSelectedRetailer(retailer)}
                    title="Click to view details"
                  >
                    <div className="flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{retailer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{retailer.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaStore className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{retailer.businessDetails?.businessType || 'Retailer'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {retailer.status === 'inactive' && (
                      <>
                        <button 
                          onClick={() => handleApprove(retailer.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs flex-1"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(retailer.id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-xs flex-1"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleBan(retailer.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs flex-1"
                        >
                          Ban
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedRetailer(retailer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs flex-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination - Mobile & Desktop */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6 pb-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                aria-label="Previous page"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-1">
                {/* Show first page */}
                {currentPage > 2 && (
                  <button
                    onClick={() => handlePageChange(1)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${currentPage === 1 ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  >
                    1
                  </button>
                )}
                
                {/* Ellipsis if needed */}
                {currentPage > 3 && <span className="text-gray-500">...</span>}
                
                {/* Page before current if it exists */}
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    {currentPage - 1}
                  </button>
                )}
                
                {/* Current page */}
                <button
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100 text-blue-600 font-medium"
                >
                  {currentPage}
                </button>
                
                {/* Page after current if it exists */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    {currentPage + 1}
                  </button>
                )}
                
                {/* Ellipsis if needed */}
                {currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}
                
                {/* Last page if not current */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                aria-label="Next page"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Retailer Details Modal */}
      {selectedRetailer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div className="flex items-center">
                <div className="mr-3">
                  <img 
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow" 
                    src={selectedRetailer.profileImage_url || "https://via.placeholder.com/48"} 
                    alt={selectedRetailer.name} 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedRetailer.name}</h2>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                      ${selectedRetailer.status === 'active' ? 'bg-green-100 text-green-800' : 
                        selectedRetailer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedRetailer.status === 'rejected' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {selectedRetailer.status === 'active' ? 'Approved' : 
                       selectedRetailer.status === 'inactive' ? 'Pending Approval' : 
                       selectedRetailer.status === 'rejected' ? 'Rejected' : 'Banned'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRetailer(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <FiUser className="mr-2 text-blue-500" /> Retailer Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Full Name</h4>
                    <p className="text-sm font-medium">{selectedRetailer.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Email Address</h4>
                    <p className="text-sm font-medium flex items-center">
                      <FiMail className="mr-1 text-gray-400" /> {selectedRetailer.email}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Phone Number</h4>
                    <p className="text-sm font-medium flex items-center">
                      <FiPhone className="mr-1 text-gray-400" /> {selectedRetailer.phone || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Registration Date</h4>
                    <p className="text-sm font-medium flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" /> {selectedRetailer.createdDate}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Address</h4>
                    <p className="text-sm font-medium flex items-start">
                      <FiMapPin className="mr-1 mt-0.5 text-gray-400" /> 
                      <span>{selectedRetailer.address || 'No address provided'}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Status Change Section */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700 mb-3">Change Retailer Status</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Current Status</label>
                    <div className={`inline-flex items-center px-3 py-2 rounded text-sm font-medium w-full
                      ${selectedRetailer.status === 'active' ? 'bg-green-100 text-green-800' : 
                        selectedRetailer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedRetailer.status === 'rejected' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {selectedRetailer.status === 'active' ? 'Approved' : 
                       selectedRetailer.status === 'inactive' ? 'Pending Approval' : 
                       selectedRetailer.status === 'rejected' ? 'Rejected' : 'Banned'}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Change Status To</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded"
                      defaultValue=""
                    >
                      <option value="" disabled>Select new status</option>
                      {selectedRetailer.status !== 'active' && <option value="active">Approve</option>}
                      {selectedRetailer.status !== 'inactive' && <option value="inactive">Set as Pending</option>}
                      {selectedRetailer.status !== 'rejected' && <option value="rejected">Reject</option>}
                      {selectedRetailer.status !== 'banned' && <option value="banned">Ban</option>}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h3>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded text-sm" 
                  rows="2"
                  placeholder="Add notes about this status change..."
                ></textarea>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-4">
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  onClick={() => {
                    const select = document.querySelector('select');
                    const newStatus = select.value;
                    const notes = document.querySelector('textarea').value;
                    
                    if (!newStatus) {
                      alert('Please select a new status');
                      return;
                    }
                    
                    const success = handleStatusChange(
                      selectedRetailer.id, 
                      selectedRetailer.status, 
                      newStatus,
                      notes
                    );
                    
                    if (success) {
                      setSelectedRetailer(null);
                    }
                  }}
                >
                  Update Status
                </button>
                <button 
                  onClick={() => setSelectedRetailer(null)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerApprovalManager;