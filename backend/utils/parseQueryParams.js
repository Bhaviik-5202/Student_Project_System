/**
 * Query Parameter Parser Utility
 * ------------------------------------------------------------------
 * Extract and sanitize pagination and filter parameters from
 * request query strings for database queries.
 */

/**
 * Parse pagination and filter parameters from request query
 * @param {Object} query - Express request query object
 * @param {Object} options - Configuration for parsing
 * @param {string[]} [options.allowedFilters=[]] - Whitelisted filter fields
 * @param {number} [options.defaultLimit=10] - Default results per page
 * @param {number} [options.maxLimit=100] - Maximum allowed limit
 * @returns {Object} { page, limit, skip, filters, sort }
 */

function parseQueryParams(query, options = {}) {
  const { allowedFilters = [], defaultLimit = 10, maxLimit = 100 } = options;

  // Safe page parsing
  const page =
    Number.isInteger(Number(query.page)) && Number(query.page) > 0
      ? Number(query.page)
      : 1;

  const requestedLimit = Number(query.limit);
  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, maxLimit)
      : defaultLimit;

  const skip = (page - 1) * limit;

  // Whitelisted filters
  const filters = {};
  for (const key of allowedFilters) {
    if (query[key] !== undefined) {
      filters[key] = query[key];
    }
  }

  let sort = {};
  if (query.sort) {
    const fields = query.sort.split(',');
    fields.forEach((field) => {
      if (field.startsWith('-')) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
  }

  return { page, limit, skip, filters, sort };
}

module.exports = parseQueryParams;
