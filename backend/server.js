require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();
// Security headers
app.use(helmet());
// JSON body parsing
app.use(express.json());

const profileRoutes = require("./src/routes/profileRoutes");
app.use("/api/profile", profileRoutes);
const staffRoutes = require("./src/routes/staffRoutes");
app.use("/api/staff", staffRoutes);
const helpRoutes = require("./src/routes/helpRoutes");
app.use("/api/help", helpRoutes);
const evaluationRoutes = require("./src/routes/evaluationRoutes");
app.use("/api/evaluation", evaluationRoutes);
const dashboardRoutes = require("./src/routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);
const settingRoutes = require("./src/routes/settingRoutes");
app.use("/api/settings", settingRoutes);
const permissionRoutes = require("./src/routes/permissionRoutes");
app.use("/api/permissions", permissionRoutes);
const backupRoutes = require("./src/routes/backupRoutes");
app.use("/api/backups", backupRoutes);
const auditLogRoutes = require("./src/routes/auditLogRoutes");
app.use("/api/audit-logs", auditLogRoutes);
const timelineRoutes = require("./src/routes/timelineRoutes");
app.use("/api/timeline", timelineRoutes);
const portfolioRoutes = require("./src/routes/portfolioRoutes");
app.use("/api/portfolio", portfolioRoutes);
const resourceRoutes = require("./src/routes/resourceRoutes");
app.use("/api/resources", resourceRoutes);
const reportRoutes = require("./src/routes/reportRoutes");
app.use("/api/reports", reportRoutes);
const collaborationRoutes = require("./src/routes/collaborationRoutes");
app.use("/api/collaboration", collaborationRoutes);
const analyticsRoutes = require("./src/routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);
const attendanceRoutes = require("./src/routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);
const courseRoutes = require("./src/routes/courseRoutes");
app.use("/api/courses", courseRoutes);
const meetingRoutes = require("./src/routes/meetingRoutes");
app.use("/api/meetings", meetingRoutes);
const assignmentRoutes = require("./src/routes/assignmentRoutes");
app.use("/api/assignments", assignmentRoutes);
const projectRoutes = require("./src/routes/projectRoutes");
app.use("/api/projects", projectRoutes);

// Middleware
const logger = require("./src/middleware/logger");
const errorHandler = require("./src/middleware/errorHandler");
// const authMiddleware = require('./src/middleware/authMiddleware'); // Uncomment to protect routes

app.use(cors());
app.use(logger);
// app.use(authMiddleware); // Uncomment to enable global JWT auth

// Import routes
const studentRoutes = require("./src/routes/studentRoutes");
app.use("/api/students", studentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

// Catch-all 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler (should be last middleware)
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/student_project_system",
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
