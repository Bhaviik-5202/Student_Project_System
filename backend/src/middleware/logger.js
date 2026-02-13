// Improved logger middleware using morgan for HTTP logs and console for errors
const morgan = require("morgan");

// HTTP request logging
const httpLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
);

// Error logger (to be used in error handler if needed)
function errorLogger(err, req, res, next) {
  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.error("Error:", err);
  }
  next(err);
}

module.exports = httpLogger;
module.exports.errorLogger = errorLogger;
