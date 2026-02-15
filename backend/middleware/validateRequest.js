const { validationResult } = require("express-validator");

/**
 * Middleware to handle express-validator errors.
 * Sends a 422 response if validation fails, otherwise proceeds to next middleware.
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: true,
      data: null,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
