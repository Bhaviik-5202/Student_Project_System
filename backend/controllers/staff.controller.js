const staffService = require("../services/staff.service");
const sendResponse = require("../utils/response");

/**
 * Create a new staff member
 * @route POST /staff
 * @access Admin
 */
exports.createStaff = async (req, res) => {
  try {
    const result = await staffService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create staff member"
          : "Staff member created successfully",
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
 * Get all staff members
 * @route GET /staff
 * @access Admin
 */
exports.getAllStaff = async (req, res) => {
  try {
    const result = await staffService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch staff members"
          : "Staff members fetched successfully",
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
 * Get a staff member by ID
 * @route GET /staff/:id
 * @access Admin
 */
exports.getStaffById = async (req, res) => {
  try {
    const result = await staffService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Staff member not found"
          : "Staff member fetched successfully",
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
 * Update a staff member by ID
 * @route PUT /staff/:id
 * @access Admin
 */
exports.updateStaff = async (req, res) => {
  try {
    const result = await staffService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update staff member"
          : "Staff member updated successfully",
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
 * Delete a staff member by ID
 * @route DELETE /staff/:id
 * @access Admin
 */
exports.deleteStaff = async (req, res) => {
  try {
    const result = await staffService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete staff member"
          : "Staff member deleted successfully",
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
