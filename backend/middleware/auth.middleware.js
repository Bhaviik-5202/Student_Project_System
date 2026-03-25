const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT Authentication Middleware
 * Validates bearer token and attaches decoded payload to req.user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = function (req, res, next) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'No token provided',
          data: null,
          error: 'Authorization header missing',
        },
        401
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: 'Invalid or expired token',
        data: null,
        error: error.message,
      },
      401
    );
  }
};
