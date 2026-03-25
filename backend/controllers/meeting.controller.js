const meetingService = require('../services/meeting.service');
const sendResponse = require('../utils/response');

/**
 * Meeting Controller
 * Manages scheduling, attendance, and details for project synchronization meetings.
 */

/**
 * Schedule a new meeting
 * @route POST /meetings
 * @access Faculty, student (if permitted)
 */
exports.createMeeting = async (req, res) => {
  try {
    const result = await meetingService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'Meeting scheduled successfully',
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
        message: 'Failed to schedule meeting',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all meetings with optional filters for role and date
 * @route GET /meetings
 * @access Authenticated
 */
exports.getAllMeetings = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await meetingService.getAll({ page, limit, filters });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch meetings'
          : 'Meetings fetched successfully',
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
 * Get detailed information for a specific meeting by ID
 * @route GET /meetings/:id
 * @access Authenticated
 */
exports.getMeetingById = async (req, res) => {
  try {
    const result = await meetingService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Meeting not found'
          : 'Meeting fetched successfully',
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
 * Update meeting schedule or attendance list
 * @route PUT /meetings/:id
 * @access Faculty, organizer
 */
exports.updateMeeting = async (req, res) => {
  try {
    const result = await meetingService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Meeting not found'
          : 'Meeting updated successfully',
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
 * Cancel and remove a scheduled meeting
 * @route DELETE /meetings/:id
 * @access Faculty, organizer, admin
 */
exports.deleteMeeting = async (req, res) => {
  try {
    const result = await meetingService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Meeting not found'
          : 'Meeting deleted successfully',
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
 * Register current user participation for a scheduled meeting
 * @route POST /meetings/:id/join
 * @access Authenticated
 */
exports.joinMeeting = async (req, res) => {
  try {
    const result = await meetingService.join(req.params.id, req.user);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Joined meeting successfully',
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
