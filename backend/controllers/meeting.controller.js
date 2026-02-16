const meetingService = require("../services/meeting.service");
const sendResponse = require("../utils/response");

/**
 * Create a new meeting
 * @route POST /meetings
 * @access Faculty, Admin
 */
exports.createMeeting = async (req, res) => {
  try {
    const result = await meetingService.create(req.body);

    sendResponse(
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
    sendResponse(
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
 * @route GET /meetings
 * @access Authenticated
 */
exports.getAllMeetings = async (req, res) => {
  try {
    const result = await meetingService.getAll();

    sendResponse(
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
    sendResponse(
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
          ? "Meeting not found"
          : "Meeting fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
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
 * Update a meeting by ID
 * @route PUT /meetings/:id
 * @access Faculty, Admin
 */
exports.updateMeeting = async (req, res) => {
  try {
    const result = await meetingService.update(req.params.id, req.body);

    sendResponse(
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
    sendResponse(
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
 * Delete a meeting by ID
 * @route DELETE /meetings/:id
 * @access Faculty, Admin
 */
exports.deleteMeeting = async (req, res) => {
  try {
    const result = await meetingService.remove(req.params.id);

    sendResponse(
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
    sendResponse(
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
