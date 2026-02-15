const morgan = require("morgan");

/**
 * Logger middleware for HTTP requests using morgan.
 * Uses 'combined' format in production and 'dev' in development.
 * Skips logging in test environment.
 * @type {import('express').RequestHandler}
 */
const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

const logger = morgan(format, {
  skip: (req, res) => process.env.NODE_ENV === "test",
});

module.exports = logger;
