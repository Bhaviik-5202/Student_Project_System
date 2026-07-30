/**
 * Student Project System - Backend Server
 * ------------------------------------------------------------------
 * Configured as a Vercel Serverless Function & Standalone Node Server.
 *  - Security middleware & rate limiting
 *  - Compression & Swagger docs
 *  - Dynamic MongoDB connection assurance for serverless environments
 *  - API routes & Global Error Handler
 */

require('dotenv').config();
require('./config/validateEnv');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const seedAdmin = require('./utils/seedAdmin');
const { backfillMissingIdentifiers } = require('./utils/idGenerator');

const httpLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const sendResponse = require('./utils/response');

const app = express();

// Trust proxy (important for deployment behind Vercel / reverse proxy)
app.set('trust proxy', 1);

// Enable gzip compression
app.use(compression());

// Secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  })
);

// Disable caching for API responses
app.use((req, res, next) => {
  res.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['*'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Middleware to ensure DB connection & seeding on Vercel Serverless Invocation
let isDbInitialized = false;
const ensureDbConnected = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (!isDbInitialized) {
      await seedAdmin();
      await backfillMissingIdentifiers();
      isDbInitialized = true;
    }
    next();
  } catch (err) {
    logger.error('Database connection error in serverless middleware', {
      err: err.message,
    });
    next(err);
  }
};

app.use(ensureDbConnected);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:
      process.env.NODE_ENV === 'test'
        ? 10000
        : Number(process.env.RATE_LIMIT_MAX) || 2000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      sendResponse(
        res,
        {
          success: false,
          message: 'Too many requests from this IP, please try again later',
          data: null,
          error: 'Rate limit exceeded',
        },
        429
      );
    },
  })
);

// Parse JSON requests
app.use(express.json());

// Professional HTTP request logger
app.use(httpLogger);

// Root health check endpoint for Vercel
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Student Project System Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Swagger Documentation
require('./config/swagger')(app);

// API Routes
const apiRoutes = require('./routes');
app.use('/api/v1', apiRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 Handler for API endpoints
app.use('/api', (req, res) => {
  sendResponse(
    res,
    {
      success: false,
      message: 'API endpoint not found',
    },
    404
  );
});

// Global Error Handler
app.use(errorHandler);

// Standalone Server Initialization (for local development & tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const ENV = process.env.NODE_ENV || 'development';

  const startServer = async () => {
    try {
      await connectDB();
      await seedAdmin();
      await backfillMissingIdentifiers();
      isDbInitialized = true;

      const server = app.listen(PORT, () => {
        logger.banner({
          port: PORT,
          env: ENV,
          dbStatus:
            mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        });
      });

      /* Graceful Shutdown */
      const shutdown = async (signal) => {
        logger.warn(`${signal} received — shutting down gracefully...`);
        await mongoose.disconnect();
        server.close(() => {
          logger.info('Server closed. All connections terminated cleanly.');
          process.exit(0);
        });
      };

      process.on('SIGINT', () => shutdown('SIGINT'));
      process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
      logger.error('Failed to start server', { err: error });
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
    }
  };

  startServer();
}

// Export Express app as Serverless Function handler
module.exports = app;
