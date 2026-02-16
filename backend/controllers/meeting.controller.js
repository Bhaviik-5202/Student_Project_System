const meetingService = require("../services/meeting.service");
const sendResponse = require("../utils/response");

/**
 * Create a new meeting
 * @route POST /api/v1/meetings
 * @access Faculty, Admin
 */
exports.createMeeting = async (req, res) => {
  try {
    const result = await meetingService.create(req.body);

    return sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create meeting"
          : "Meeting created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Join a meeting
 * @route POST /api/v1/meetings/:id/join
 * @access Authenticated
 */
exports.joinMeeting = async (req, res) => {
  try {
    const result = await meetingService.join(req.params.id, req.user);

    return sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to join meeting"
          : "Joined meeting successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get all meetings
 * @route GET /api/v1/meetings
 * @access Authenticated
 */
exports.getAllMeetings = async (req, res) => {
  try {
    const result = await meetingService.getAll();

    return sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch meetings"
          : "Meetings fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get a meeting by ID
 * @route GET /api/v1/meetings/:id
 * @access Authenticated
 */
exports.getMeetingById = async (req, res) => {
  try {
    const result = await meetingService.getById(req.params.id);

    return sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Meeting not found"
          : "Meeting fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Update a meeting
 * @route PUT /api/v1/meetings/:id
 * @access Faculty, Admin
 */
exports.updateMeeting = async (req, res) => {
  try {
    const result = await meetingService.update(req.params.id, req.body);

    return sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update meeting"
          : "Meeting updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Delete a meeting
 * @route DELETE /api/v1/meetings/:id
 * @access Faculty, Admin
 */
exports.deleteMeeting = async (req, res) => {
  try {
    const result = await meetingService.remove(req.params.id);

    return sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete meeting"
          : "Meeting deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
