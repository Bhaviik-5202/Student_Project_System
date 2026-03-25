const analyticsService = require('../services/analytics.service');
const sendResponse = require('../utils/response');

/**
 * Analytics Controller
 * Provides high-level system insights, usage statistics, and performance metrics.
 */

/**
 * Get dashboard statistics
 * @route   GET /api/analytics/dashboard
 * @desc    Retrieve high-level system-wide metrics for the admin dashboard
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get project analytics
 * @route   GET /api/analytics/projects
 * @desc    Retrieve detailed metrics on project completion, health, and trends
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get user analytics
 * @route   GET /api/analytics/users
 * @desc    Retrieve statistics on user registration, roles, and engagement
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get faculty stats
 * @route   GET /api/analytics/faculty-dashboard
 * @desc    Retrieve specialized metrics for the faculty-specific dashboard
 * @access  Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Get student stats
 * @route   GET /api/analytics/student-dashboard
 * @desc    Retrieve personalized academic and project metrics for a student
 * @access  Student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
