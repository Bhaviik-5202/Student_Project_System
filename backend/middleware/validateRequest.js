const { validationResult } = require("express-validator");
const sendResponse = require("../utils/response");

/**
 * Middleware to handle express-validator errors.
 * Sends a 422 response if validation fails.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Validation failed",
        data: null,
        error: "Input validation error",
        details: errors.array().map((e) => e.msg),
      },
      422,
    );
  }

  next();
};
