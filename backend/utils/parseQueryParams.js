// Utility for pagination and filtering
// Usage: const { page, limit, skip, filters } = parseQueryParams(req.query, allowedFilters)
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
