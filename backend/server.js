require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morganLogger = require("./middleware/logger");
const connectDB = require("./config/db");
const path = require("path");
const sendResponse = require("./utils/response");

const app = express();

// Trust proxy (for deployments behind reverse proxies like Heroku, Nginx)
app.set("trust proxy", 1);

// Enable gzip compression
app.use(compression());

// Security headers
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  }),
);
// Enable CORS with config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
// JSON body parsing
app.use(express.json());

// Logger middleware
app.use(morganLogger);

// Swagger API docs
require("./config/swagger")(app);

// Centralized route loader
const apiRoutes = require("./routes/index.js");
app.use("/api/v1", apiRoutes);

// 404 handler (centralized response)
app.use((req, res, next) => {
  sendResponse(
    res,
    { error: true, data: null, message: "API endpoint not found" },
    404,
  );
});

// Global error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Always connect to DB (for both server and tests)
const startServer = async () => {
  await connectDB();
  if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      await mongoose.disconnect();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  }
};

startServer();

// Export app for testing
module.exports = app;
