const analyticsService = require("../services/analytics.service");
const sendResponse = require("../utils/response");

/**
 * Analytics Controller
 * Provides high-level system insights, usage statistics, and performance metrics.
 */

/**
 * Fetch general system-wide dashboard statistics
 * @route GET /analytics/dashboard
 * @access Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await analyticsService.getGlobalStats();
    sendResponse(
      res,
      {
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: stats,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch dashboard statistics",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Fetch project metrics and completion trends
 * @route GET /analytics/projects
 * @access Admin, Faculty
 */
exports.getProjectAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getProjectStats();
    sendResponse(
      res,
      {
        success: true,
        message: "Project analytics fetched successfully",
        data: analytics,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch project analytics",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Fetch user engagement and activity metrics
 * @route GET /analytics/users
 * @access Admin
 */
exports.getUserAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getUserStats();
    sendResponse(
      res,
      {
        success: true,
        message: "User analytics fetched successfully",
        data: analytics,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch user analytics",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
/**
 * Fetch faculty-specific dashboard metrics
 * @route GET /analytics/faculty-dashboard
 * @access Faculty
 */
exports.getFacultyDashboardStats = async (req, res) => {
  try {
    const stats = await analyticsService.getFacultyDashboardStats(req.user.id);
    sendResponse(
      res,
      {
        success: true,
        message: "Faculty dashboard statistics fetched successfully",
        data: stats,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch faculty statistics",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Fetch student-specific performance and project metrics
 * @route GET /analytics/student-dashboard
 * @access Student
 */
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const stats = await analyticsService.getStudentDashboardStats(req.user.id);
    sendResponse(
      res,
      {
        success: true,
        message: "Student dashboard statistics fetched successfully",
        data: stats,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch student statistics",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
