const activityService = require("../services/activity.service");
const sendResponse = require("../utils/response");

/**
 * Create a new activity
 * @route POST /activities
 * @access Admin, Faculty
 */
exports.createActivity = async (req, res) => {
  try {
    const result = await activityService.create(req.body);

    if (!result) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Failed to create activity",
          data: null,
          error: "Activity creation failed",
        },
        400,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Activity created successfully",
        data: result,
        error: null,
      },
      201,
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
 * Get all activities
 * @route GET /activities
 * @access Authenticated
 */
exports.getAllActivities = async (req, res) => {
  try {
    const result = await activityService.getAll();

    sendResponse(
      res,
      {
        success: true,
        message: "Activities fetched successfully",
        data: result,
        error: null,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to fetch activities",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get an activity by ID
 * @route GET /activities/:id
 * @access Authenticated
 */
exports.getActivityById = async (req, res) => {
  try {
    const result = await activityService.getById(req.params.id);

    if (!result) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Activity not found",
          data: null,
          error: "Invalid activity ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Activity fetched successfully",
        data: result,
        error: null,
      },
      200,
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
 * Update an activity by ID
 * @route PUT /activities/:id
 * @access Admin, Faculty
 */
exports.updateActivity = async (req, res) => {
  try {
    const result = await activityService.update(req.params.id, req.body);

    if (!result) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Activity not found",
          data: null,
          error: "Invalid activity ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Activity updated successfully",
        data: result,
        error: null,
      },
      200,
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
 * Delete an activity by ID
 * @route DELETE /activities/:id
 * @access Admin, Faculty
 */
exports.deleteActivity = async (req, res) => {
  try {
    const result = await activityService.remove(req.params.id);

    if (!result) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Activity not found",
          data: null,
          error: "Invalid activity ID",
        },
        404,
      );
    }

    sendResponse(
      res,
      {
        success: true,
        message: "Activity deleted successfully",
        data: result,
        error: null,
      },
      200,
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
