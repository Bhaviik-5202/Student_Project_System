// Centralized route loader for all API endpoints
const express = require("express");
const router = express.Router();

// Import all route modules
const activityRoutes = require("./activity.route");
const assignmentRoutes = require("./assignment.route");
const attendanceRoutes = require("./attendance.route");
const auditlogRoutes = require("./auditlog.route");
const authRoutes = require("./auth.route");
const portfolioRoutes = require("./portfolio.route");
const coursesRoutes = require("./courses.route");
const projectRoutes = require("./project.route");
const resourceRoutes = require("./resource.route");
const staffRoutes = require("./staff.route");
const studentRoutes = require("./student.route");
const submissionRoutes = require("./submission.route");
const timelineRoutes = require("./timeline.route");
const notificationRoutes = require("./notification.route");
const userRoutes = require("./user.route");
const healthRoutes = require("./health.route");
const analyticsRoutes = require("./analytics.route");

// Mount all routes under /api/v1
router.use("/activity", activityRoutes);
router.use("/assignment", assignmentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/auditlog", auditlogRoutes);
router.use("/auth", authRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/projects", projectRoutes);
router.use("/resources", resourceRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/courses", coursesRoutes);
router.use("/project", projectRoutes);
router.use("/resource", resourceRoutes);
router.use("/staff", staffRoutes);
router.use("/student", studentRoutes);
router.use("/students", studentRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/submission", submissionRoutes);
router.use("/submissions", submissionRoutes);
router.use("/timeline", timelineRoutes);
router.use("/dashboard/notifications", notificationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);

router.use("/health", healthRoutes);
router.use("/analytics", analyticsRoutes);

// Root API info endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Project System API",
    version: "v1",
    availableRoutes: [
      "/activity",
      "/assignment",
      "/attendance",
      "/auditlog",
      "/auth",
      "/portfolio",
      "/project",
      "/resource",
      "/staff",
      "/student",
      "/submission",
      "/timeline",
      "/user",
      "/health",
      "/courses",
    ],
  });
});

module.exports = router;
