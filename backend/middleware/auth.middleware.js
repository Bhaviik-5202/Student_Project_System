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

    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      let rawToken = String(req.query.token).trim();
      try {
        rawToken = decodeURIComponent(rawToken);
      } catch (e) {
        // Fallback if token was not URL encoded
      }
      token = rawToken.replace(/^"|"$/g, '').replace(/ /g, '+');
    }

    if (!token) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'No token provided',
          data: null,
          error: 'Authorization header or query token missing',
        },
        401
      );
    }

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
