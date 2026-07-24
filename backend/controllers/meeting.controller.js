const meetingService = require('../services/meeting.service');
const sendResponse = require('../utils/response');

/**
 * Meeting Controller
 * Manages scheduling, attendance, and details for project synchronization meetings.
 */

/**
 * Schedule a new meeting
 * @route   POST /api/meetings
 * @desc    Register a new project synchronization meeting
 * @access  Faculty, Student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createMeeting = async (req, res) => {
  try {
    if (
      req.body.date &&
      new Date(req.body.date) < new Date(Date.now() - 60000)
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Meeting date and time cannot be in the past',
          data: null,
          error: 'Invalid meeting date',
        },
        422
      );
    }

    const result = await meetingService.create(req.body, req.user);

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
 * Fetch all meetings
 * @route   GET /api/meetings
 * @desc    Retrieve a paginated list of all scheduled meetings
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllMeetings = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    delete filters._t;
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
 * Get meeting by ID
 * @route   GET /api/meetings/:id
 * @desc    Retrieve detailed info and participant list for a meeting
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Update a meeting
 * @route   PUT /api/meetings/:id
 * @desc    Modify schedule, agenda, or participants for a meeting
 * @access  Faculty, Organizer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Cancel a meeting
 * @route   DELETE /api/meetings/:id
 * @desc    Permanently remove a scheduled meeting
 * @access  Faculty, Organizer, Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
 * Join a meeting
 * @route   POST /api/meetings/:id/join
 * @desc    Register participation for the currently authenticated user
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
