// middleware/errorHandler.js
const sendResponse = require("../utils/response");

// Centralized error handler middleware
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const error = process.env.NODE_ENV === "production" ? undefined : err.stack;
  sendResponse(res, { error, data: null, message }, status);
};
