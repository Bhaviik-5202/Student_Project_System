// Centralized response utility for consistent API responses
// Usage: sendResponse(res, { error, data, message }, status)
module.exports = function (res, { error, data, message }, status = 200) {
  res.status(status).json({ error, data, message });
};
