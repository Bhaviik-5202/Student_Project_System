const analyticsService = require('../services/analytics.service');
const sendResponse = require('../utils/response');

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
    const { error, data, message } = await analyticsService.getGlobalStats();
    if (error) throw new Error(message);

    sendResponse(
      res,
      {
        success: true,
        message: message || 'Dashboard statistics fetched successfully',
        data: data,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: error.message || 'Failed to fetch dashboard statistics',
        data: null,
        error: error.message,
      },
      500
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
    const { error, data, message } = await analyticsService.getProjectStats();
    if (error) throw new Error(message);

    sendResponse(
      res,
      {
        success: true,
        message: message || 'Project analytics fetched successfully',
        data: data,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: error.message || 'Failed to fetch project analytics',
        data: null,
        error: error.message,
      },
      500
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
    const { error, data, message } = await analyticsService.getUserStats();
    if (error) throw new Error(message);

    sendResponse(
      res,
      {
        success: true,
        message: message || 'User analytics fetched successfully',
        data: data,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: error.message || 'Failed to fetch user analytics',
        data: null,
        error: error.message,
      },
      500
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
    const { error, data, message } =
      await analyticsService.getFacultyDashboardStats(req.user.id);
    if (error) throw new Error(message);

    sendResponse(
      res,
      {
        success: true,
        message: message || 'Faculty dashboard statistics fetched successfully',
        data: data,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: error.message || 'Failed to fetch faculty statistics',
        data: null,
        error: error.message,
      },
      500
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
    const { error, data, message } =
      await analyticsService.getStudentDashboardStats(req.user.id);
    if (error) throw new Error(message);

    sendResponse(
      res,
      {
        success: true,
        message: message || 'Student dashboard statistics fetched successfully',
        data: data,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: error.message || 'Failed to fetch student statistics',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get grade distribution
 * @route GET /analytics/grade-distribution
 * @access Admin
 */
exports.getGradeDistribution = async (req, res) => {
  try {
    const { error, data, message } =
      await analyticsService.getGradeDistribution();
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get performance metrics
 * @route GET /analytics/performance-metrics
 * @access Admin
 */
exports.getPerformanceMetrics = async (req, res) => {
  try {
    const { error, data, message } =
      await analyticsService.getPerformanceMetrics();
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get progress analytics
 * @route GET /analytics/progress-analytics
 * @access Admin
 */
exports.getProgressAnalytics = async (req, res) => {
  try {
    const { error, data, message } =
      await analyticsService.getProgressAnalytics();
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get usage statistics
 * @route GET /analytics/usage-statistics
 * @access Admin
 */
exports.getUsageStatistics = async (req, res) => {
  try {
    const { error, data, message } =
      await analyticsService.getUsageStatistics();
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};
