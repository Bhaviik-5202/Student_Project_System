const sendResponse = require('../utils/response');

/**
 * Global Error Handler Middleware
 * Intercepts all application errors and returns standardized JSON responses.
 * @param {Object} err - Express error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = undefined;

  // express-validator errors
  if (err.errors && Array.isArray(err.errors)) {
    status = 422;
    message = 'Validation failed';
    details = err.errors.map((e) => e.msg || e.message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Database validation error';
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate key error';
    details = err.keyValue;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Hide stack trace in production
  const errorMessage =
    process.env.NODE_ENV === 'production' ? message : err.stack || message;

  sendResponse(
    res,
    {
      success: false,
      message,
      data: null,
      error: errorMessage,
      details: details || null,
    },
    status
  );
};
