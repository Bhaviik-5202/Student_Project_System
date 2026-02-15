const sendResponse = require("../utils/response");

/**
 * Centralized error handler middleware for Express.
 * Handles validation, database, JWT, and generic errors.
 * @function
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  let error = process.env.NODE_ENV === "production" ? undefined : err.stack;
  let details = undefined;

  // Handle express-validator errors
  if (err.errors && Array.isArray(err.errors)) {
    status = 422;
    message = "Validation failed";
    details = err.errors;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    status = 400;
    message = "Database validation error";
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Handle MongoDB duplicate key error
  if (err.code && err.code === 11000) {
    status = 409;
    message = "Duplicate key error";
    details = err.keyValue;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  }

  // Fallback for generic errors
  sendResponse(
    res,
    {
      error: error || details,
      data: null,
      message,
      details,
    },
    status,
  );
};
