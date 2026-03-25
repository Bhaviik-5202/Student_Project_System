const morgan = require('morgan');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

/**
 * Logger middleware for HTTP requests using morgan.
 * - 'dev' format in development
 * - 'combined' format in production
 * - Disabled in test environment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logger = morgan(isProduction ? 'combined' : 'dev', {
  skip: () => isTest,
});

module.exports = logger;
