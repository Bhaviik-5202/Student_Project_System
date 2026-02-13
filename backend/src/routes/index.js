// Centralized route loader for all API routes
const express = require("express");
const router = express.Router();

// Root endpoint for /api/v1
router.get("/", (req, res) => {
  res.json({ success: true, message: "Student Project System API v1" });
});

// Import all route modules (alphabetical for clarity)
const analyticsRoutes = require("./analyticsRoutes");
const assignmentRoutes = require("./assignmentRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const auditLogRoutes = require("./auditLogRoutes");
const authRoutes = require("./authRoutes");
const backupRoutes = require("./backupRoutes");
const collaborationRoutes = require("./collaborationRoutes");
const courseRoutes = require("./courseRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const evaluationRoutes = require("./evaluationRoutes");
const helpRoutes = require("./helpRoutes");
const meetingRoutes = require("./meetingRoutes");
const permissionRoutes = require("./permissionRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const profileRoutes = require("./profileRoutes");
const projectRoutes = require("./projectRoutes");
const reportRoutes = require("./reportRoutes");
const resourceRoutes = require("./resourceRoutes");
const settingRoutes = require("./settingRoutes");
const staffRoutes = require("./staffRoutes");
const studentRoutes = require("./studentRoutes");
const submissionRoutes = require("./submissionRoutes");
const timelineRoutes = require("./timelineRoutes");
const userRoutes = require("./userRoutes");

// Mount all routes under /api/v1/feature (alphabetical for clarity)
router.use("/analytics", analyticsRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/auth", authRoutes);
router.use("/backups", backupRoutes);
router.use("/collaboration", collaborationRoutes);
router.use("/courses", courseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/evaluation", evaluationRoutes);
router.use("/help", helpRoutes);
router.use("/meetings", meetingRoutes);
router.use("/permissions", permissionRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/reports", reportRoutes);
router.use("/resources", resourceRoutes);
router.use("/settings", settingRoutes);
router.use("/staff", staffRoutes);
router.use("/students", studentRoutes);
router.use("/submissions", submissionRoutes);
router.use("/timeline", timelineRoutes);
router.use("/users", userRoutes);

module.exports = router;
