const timelineService = require('../services/timeline.service');
const sendResponse = require('../utils/response');

/**
 * Timeline Controller
 * Manages project milestones, Gantt chart data, and project scheduling events.
 */

/**
 * Add a new milestone or event to a project timeline
 * @route POST /timelines
 * @access Faculty, Admin
 */
exports.createTimeline = async (req, res) => {
  try {
    const result = await timelineService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'Timeline event created successfully',
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
        message: 'Failed to create timeline event',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all timeline events across all projects
 * @route GET /timelines
 * @access Authenticated
 */
exports.getAllTimelines = async (req, res) => {
  try {
    const result = await timelineService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch timeline events'
          : 'Timeline events fetched successfully',
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
 * Get detailed metadata for a specific timeline event by ID
 * @route GET /timelines/:id
 * @access Authenticated
 */
exports.getTimelineById = async (req, res) => {
  try {
    const result = await timelineService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Timeline event not found'
          : 'Timeline event fetched successfully',
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
 * Retrieve all timeline milestones associated with a specific project
 * @route GET /timelines/project/:projectId
 * @access Authenticated
 */
exports.getTimelineEventsByProject = async (req, res) => {
  try {
    const result = await timelineService.getByProjectId(req.params.projectId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Timeline events not found for project'
          : 'Timeline events fetched successfully',
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
 * Update project milestone details, dates, or status
 * @route PUT /timelines/:id
 * @access Faculty, Admin
 */
exports.updateTimeline = async (req, res) => {
  try {
    const result = await timelineService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Timeline event not found'
          : 'Timeline event updated successfully',
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
 * Terminate a project timeline event
 * @route DELETE /timelines/:id
 * @access Faculty, Admin
 */
exports.deleteTimeline = async (req, res) => {
  try {
    const result = await timelineService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Timeline event not found'
          : 'Timeline event deleted successfully',
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
