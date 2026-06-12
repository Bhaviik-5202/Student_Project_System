const activityService = require('../services/activity.service');
const sendResponse = require('../utils/response');

/**
 * Activity Controller
 * Tracks and manages user activities, system events, and interaction history.
 */

/**
 * Log a new activity
 * @route   POST /api/activities
 * @desc    Record a new user action or system event in the activity log
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createActivity = async (req, res) => {
  try {
    const result = await activityService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Activity logged successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to log activity',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all activities
 * @route   GET /api/activities
 * @desc    Retrieve a paginated list of all recorded system activities
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    delete filters._t;
    const result = await activityService.getAll({ page, limit, filters });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch activities'
          : 'Activities fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get activity by ID
 * @route   GET /api/activities/:id
 * @desc    Retrieve detailed information for a specific activity record
 * @access  Admin, Faculty
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getActivityById = async (req, res) => {
  try {
    const result = await activityService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Activity not found'
          : 'Activity fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Fetch user activities
 * @route   GET /api/activities/user/:userId
 * @desc    Retrieve chronological activity history for a specific user
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getActivitiesByUserId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await activityService.getByUserId(req.params.userId, {
      page,
      limit,
    });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch user activities'
          : 'User activities fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
/**
 * Update activity record
 * @route   PUT /api/activities/:id
 * @desc    Modify metadata or description for an existing activity log
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateActivity = async (req, res) => {
  try {
    const result = await activityService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Activity not found'
          : 'Activity updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Delete an activity log
 * @route   DELETE /api/activities/:id
 * @desc    Permanently remove an activity entry from the system
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteActivity = async (req, res) => {
  try {
    const result = await activityService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Activity not found'
          : 'Activity deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
