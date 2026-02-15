// middleware/logger.js
const morgan = require("morgan");

// Use 'combined' for production, 'dev' for development
const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

const logger = morgan(format, {
  skip: (req, res) => process.env.NODE_ENV === "test",
});

// Logger middleware for HTTP requests
module.exports = logger;
