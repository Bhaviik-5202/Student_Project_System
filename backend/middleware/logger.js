/**
 * HTTP Request Logger Middleware
 * ------------------------------------------------------------------
 * Uses Morgan with a custom finish-event handler to produce
 * professional, boxed, colored HTTP logs via the Winston logger.
 *
 * - Development : prints every request in the boxed format
 * - Production  : prints only 4xx / 5xx requests
 * - Test        : completely silent
 *
 * Slow-request detection: requests taking > SLOW_REQUEST_MS (default 2000ms)
 * automatically emit a perf warning after the response finishes.
 */

const logger = require('../utils/logger');

const isTest = process.env.NODE_ENV === 'test';
const SLOW_MS = Number(process.env.SLOW_REQUEST_MS) || 2000;

/**
 * Express middleware that intercepts the response `finish` event
 * and logs the completed request through the professional logger.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const httpLogger = (req, res, next) => {
  if (isTest) return next();

  const startAt = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(startAt);
    const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    const durationMs = parseFloat(duration);

    const method = req.method;
    const route = req.originalUrl || req.url;
    const status = res.statusCode;
    const size = res.get('Content-Length') || '-';
    const ip =
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      '-';

    logger.http({ method, route, status, duration, size, ip });

    // Slow-request performance warning
    if (durationMs > SLOW_MS) {
      logger.perf({ route, method, duration: durationMs.toFixed(0) });
    }
  });

  next();
};

module.exports = httpLogger;
