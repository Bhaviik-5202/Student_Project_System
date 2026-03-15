/**
 * Centralized Route Loader
 * ------------------------------------------------------------------
 * Mounts all API endpoints under /api/v1
 * Maintains consistent RESTful naming conventions.
 */

const express = require("express");
const router = express.Router();

// Import route modules
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
const meetingsRoutes = require("./meetings.route");
const chatroutes = require("./chat.route");
const messageRoutes = require("./message.route");
const evaluationRoutes = require("./evaluation.route");
const supportTicketRoutes = require("./supportticket.route");
const settingRoutes = require("./setting.route");
const faqRoutes = require("./faq.route");
const knowledgeBaseRoutes = require("./knowledgebase.route");

/**
 * Mount routes (Plural REST Convention)
 */
router.use("/activities", activityRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/auditlogs", auditlogRoutes);
router.use("/auth", authRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/courses", coursesRoutes);
router.use("/projects", projectRoutes);
router.use("/resources", resourceRoutes);
router.use("/staff", staffRoutes);
router.use("/students", studentRoutes);
router.use("/submissions", submissionRoutes);
router.use("/timelines", timelineRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);
router.use("/health", healthRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/meetings", meetingsRoutes);
router.use("/chats", chatroutes);
router.use("/messages", messageRoutes);
router.use("/evaluations", evaluationRoutes);
router.use("/supporttickets", supportTicketRoutes);
router.use("/settings", settingRoutes);
router.use("/faqs", faqRoutes);
router.use("/knowledgebase", knowledgeBaseRoutes);
/**
 * Root API Information Endpoint
 * GET /api/v1
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Project System API",
    version: "v1",
    baseUrl: "/api/v1",
  });
});

module.exports = router;
