// Main server entry point for the Student Project System backend
// Sets up Express app, middleware, API routes, error handling, and server startup

// Load environment variables and dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morganLogger = require("./middleware/logger");
const connectDB = require("./config/db");
const sendResponse = require("./utils/response");

const app = express(); // Create Express app

// Middleware setup
app.set("trust proxy", 1); // Trust proxy for deployments

app.use(compression()); // Enable gzip compression

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  }),
);

app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json()); // Parse JSON bodies

app.use(morganLogger); // HTTP request logging

// Swagger API docs
require("./config/swagger")(app); // Sets up Swagger UI at /api-docs

// API routes
const apiRoutes = require("./routes/index.js");
app.use("/api/v1", apiRoutes); // Mount all API v1 routes

// 404 handler for undefined API endpoints
app.use((req, res, next) => {
  sendResponse(
    res,
    { error: true, data: null, message: "API endpoint not found" },
    404,
  );
});

// Global error handler
const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler); // Handles all uncaught errors

// Database connection & server startup
const startServer = async () => {
  try {
    await connectDB();
    if (require.main === module) {
      const PORT = process.env.PORT || 5000;
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
      // Graceful shutdown on SIGINT
      process.on("SIGINT", async () => {
        console.log("Shutting down server...");
        await mongoose.disconnect();
        server.close(() => {
          console.log("Server closed");
          process.exit(0);
        });
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

// Export Express app for testing (e.g., with supertest)
module.exports = app;

// Request flow through middleware and routes:
/*
Request
   ↓
Security (helmet)
   ↓
CORS
   ↓
Rate limit
   ↓
JSON parser
   ↓
Logger
   ↓
Routes
   ↓
404 handler
   ↓
Error handler
   ↓
Response
*/
