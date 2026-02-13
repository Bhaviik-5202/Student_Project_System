require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morganLogger = require("./src/middleware/logger");
const path = require("path");

const app = express();

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

// Centralized API route loader
const apiRoutes = require("./src/routes");
app.use("/api/v1", apiRoutes);

// Health check endpoint (versioned)
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "Backend running" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Global error handler
const errorHandler = require("./src/middleware/errorHandler");
app.use(errorHandler);

// Async MongoDB connection and server start
async function startServer() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/student_project_system";
    if (!mongoUri) {
      throw new Error("MongoDB URI not set in environment variables.");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
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
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

// Export app for testing
module.exports = app;

