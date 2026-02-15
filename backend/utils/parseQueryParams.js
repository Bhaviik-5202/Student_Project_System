/**
 * Utility for parsing pagination and filter query parameters.
 * Returns page, limit, skip, and allowed filters from the query object.
 *
 * @param {Object} query - The query object (e.g., req.query)
 * @param {string[]} [allowedFilters=[]] - List of allowed filter keys
 * @returns {{ page: number, limit: number, skip: number, filters: Object }} Parsed pagination and filters
 */
function parseQueryParams(query, allowedFilters = []) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const filters = {};
  allowedFilters.forEach((key) => {
    if (query[key] !== undefined) filters[key] = query[key];
  });
  return { page, limit, skip, filters };
}

module.exports = parseQueryParams;
