const { validationResult } = require('express-validator');
const sendResponse = require('../utils/response');

/**
 * Request Validation Middleware
 * Processes express-validator results and returns 422 for validation failures.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors
      .array()
      .map((e) => `${e.path || e.param || 'field'}: ${e.msg}`);
    const firstMsg = errors.array()[0]?.msg || 'Validation failed';
    return sendResponse(
      res,
      {
        success: false,
        message: `Validation failed - ${firstMsg}`,
        data: null,
        error: 'Input validation error',
        details: errorDetails,
      },
      422
    );
  }

  next();
};
