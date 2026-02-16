const timelineService = require("../services/timeline.service");
const sendResponse = require("../utils/response");

/**
 * Create a new timeline event
 * @route POST /timelines
 * @access Admin, Faculty
 */
exports.createTimeline = async (req, res) => {
  try {
    const result = await timelineService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create timeline event"
          : "Timeline event created successfully",
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
 * Get all timeline events
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
          ? "Failed to fetch timeline events"
          : "Timeline events fetched successfully",
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
 * Get a timeline event by ID
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
          ? "Timeline event not found"
          : "Timeline event fetched successfully",
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
 * Update a timeline event by ID
 * @route PUT /timelines/:id
 * @access Admin, Faculty
 */
exports.updateTimeline = async (req, res) => {
  try {
    const result = await timelineService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update timeline event"
          : "Timeline event updated successfully",
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
 * Delete a timeline event by ID
 * @route DELETE /timelines/:id
 * @access Admin, Faculty
 */
exports.deleteTimeline = async (req, res) => {
  try {
    const result = await timelineService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete timeline event"
          : "Timeline event deleted successfully",
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
