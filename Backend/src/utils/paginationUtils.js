/**
 * Extract pagination parameters from request query
 * @param {Object} req - Express request object
 * @returns {Object} Pagination parameters
 */
export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Create pagination response metadata
 * @param {number} count - Total count of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const createPaginationResponse = (count, page, limit) => ({
  currentPage: page,
  totalPages: Math.ceil(count / limit),
  totalItems: count,
  itemsPerPage: limit
});

export default {
  getPaginationParams,
  createPaginationResponse,
};