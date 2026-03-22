const morgan = require('morgan');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

/**
 * Logger middleware for HTTP requests using morgan.
 * - 'dev' format in development
 * - 'combined' format in production
 * - Disabled in test environment
 */
const logger = morgan(isProduction ? 'combined' : 'dev', {
  skip: () => isTest,
});

module.exports = logger;
