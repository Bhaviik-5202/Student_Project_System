const staffService = require("../services/staff.service");
const sendResponse = require("../utils/response");

/**
 * Staff Controller
 * Manages faculty and administrator profiles, departmental assignments, and professional information.
 */

/**
 * Register a new staff member (Faculty or Admin)
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
        message: result.error ? result.message : "Staff created successfully",
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
 * Fetch all staff records
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
          ? "Failed to fetch staff"
          : "Staff fetched successfully",
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
 * Get detailed information for a specific staff member
 * @route GET /staff/:id
 * @access Authenticated
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
 * Update staff profile or departmental role
 * @route PUT /staff/:id
 * @access Admin, Staff (own profile)
 */
exports.updateStaff = async (req, res) => {
  try {
    const result = await staffService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Staff member not found"
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
 * Permanently remove a staff record
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
          ? "Staff member not found"
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
