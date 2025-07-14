import React, { useState, useCallback } from 'react';

// Configuration constants
export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 9,
  LOAD_MORE_INCREMENT: 6,
};

/**
 * Custom hook for handling pagination logic
 * @param {Function} apiCall - Function to call API with pagination params
 * @param {Object} options - Configuration options
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (apiCall, options = {}) => {
  const {
    limit = PAGINATION_CONFIG.DEFAULT_LIMIT,
    resetOnDependencyChange = true,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit,
  });
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchData = useCallback(async (page = 1, append = false, ...params) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await apiCall(page, limit, ...params);
      
      if (response.success) {
        if (append) {
          setData(prev => [...prev, ...response.data]);
        } else {
          setData(response.data);
        }
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Pagination fetch error:', err);
      setError(err.message);
      if (!append) setData([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [apiCall, limit]);

  // Load more data
  const loadMore = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages && !loadingMore) {
      fetchData(pagination.currentPage + 1, true);
    }
  }, [fetchData, pagination.currentPage, pagination.totalPages, loadingMore]);

  // Reset pagination
  const reset = useCallback(() => {
    setData([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: limit,
    });
    setError(null);
  }, [limit]);

  // Check if more data can be loaded
  const hasMore = pagination.currentPage < pagination.totalPages;
  const remainingItems = pagination.totalItems - data.length;

  return {
    data,
    loading,
    loadingMore,
    pagination,
    error,
    fetchData,
    loadMore,
    reset,
    hasMore,
    remainingItems,
  };
};

/**
 * Build query parameters for API calls
 * @param {Object} params - Parameters object
 * @returns {URLSearchParams} URL search parameters
 */
export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams;
};

/**
 * Create pagination metadata for responses
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination metadata
 */
export const createPaginationMeta = (totalItems, currentPage, itemsPerPage) => ({
  currentPage,
  totalPages: Math.ceil(totalItems / itemsPerPage),
  totalItems,
  itemsPerPage,
  hasNext: currentPage < Math.ceil(totalItems / itemsPerPage),
  hasPrev: currentPage > 1,
});

/**
 * Load More Button Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Load more button
 */
export const LoadMoreButton = ({ 
  onClick, 
  loading, 
  hasMore, 
  remainingItems,
  className = "",
  loadingText = "Loading...",
  buttonText = "Load More"
}) => {
  if (!hasMore) return null;

  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        disabled={loading}
        className={`bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{loadingText}</span>
          </div>
        ) : (
          `${buttonText} (${remainingItems} remaining)`
        )}
      </button>
    </div>
  );
};

/**
 * Loading Spinner Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Loading spinner
 */
export const LoadingSpinner = ({ 
  text = "Loading...", 
  className = "",
  size = "h-8 w-8" 
}) => (
  <div className={`text-center py-8 ${className}`}>
    <div className={`inline-block animate-spin rounded-full ${size} border-b-2 border-blue-600 mx-auto mb-4`}></div>
    <p className="text-gray-600">{text}</p>
  </div>
);

export default {
  usePagination,
  buildQueryParams,
  createPaginationMeta,
  LoadMoreButton,
  LoadingSpinner,
};