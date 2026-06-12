/**
 * Student Project System - Backend Server
 * ------------------------------------------------------------------
 * Initializes Express application with:
 *  - Security middleware
 *  - Rate limiting
 *  - Compression
 *  - Logging
 *  - Swagger docs
 *  - API routes
 *  - Error handling
 *  - Graceful shutdown
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
const seedAdmin = async () => {
  try {
    const seed = require('./utils/seedAdmin');
    await seed();
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  }
};
const morganLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const sendResponse = require('./utils/response');

const app = express();

// Trust proxy (important for deployment behind reverse proxy)
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
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Parse JSON requests
app.use(express.json());

// HTTP request logger
app.use(morganLogger);

//  Swagger Documentation
require('./config/swagger')(app);

//  API Routes
const apiRoutes = require('./routes');
app.use('/api/v1', apiRoutes);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  404 Handler
app.use((req, res) => {
  sendResponse(
    res,
    {
      success: false,
      message: 'API endpoint not found',
    },
    404
  );
});

//  Global Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    if (require.main === module) {
      const PORT = process.env.PORT || 5000;

      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      /* Graceful Shutdown */
      const shutdown = async () => {
        console.log('🔻 Shutting down server...');
        await mongoose.disconnect();
        server.close(() => {
          console.log('Server closed cleanly');
          process.exit(0);
        });
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error; // Re-throw for tests
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
