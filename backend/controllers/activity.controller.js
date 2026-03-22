const activityService = require('../services/activity.service');
const sendResponse = require('../utils/response');

/**
 * Activity Controller
 * Tracks and manages user activities, system events, and interaction history.
 */

/**
 * Log a new activity or event
 * @route POST /activities
 * @access Authenticated
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
 * Fetch activity logs with pagination and filtering
 * @route GET /activities
 * @access Admin, Faculty
 */
exports.getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
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
 * Get detailed information for a specific activity record
 * @route GET /activities/:id
 * @access Admin, Faculty
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
 * Fetch activity history for a specific user
 * @route GET /activities/user/:userId
 * @access Authenticated
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
 * Update project-wide activity settings or configurations
 * @route PUT /activities/:id
 * @access Admin
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
 * Remove an activity log entry from the system
 * @route DELETE /activities/:id
 * @access Admin
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
