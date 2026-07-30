const staffService = require('../services/staff.service');
const sendResponse = require('../utils/response');

/**
 * Staff Controller
 * Manages faculty profiles, departmental assignments, and professional information.
 */

/**
 * Register a new staff member
 * @route   POST /api/staff
 * @desc    Onboard a new faculty profile with departmental info
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createStaff = async (req, res) => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    )
      .toLowerCase()
      .trim();

    if (
      req.body?.role === 'admin' ||
      req.body?.email?.toLowerCase().trim() === superAdminEmail
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Super Admin account is protected and cannot be modified.',
        },
        403
      );
    }

    const result = await staffService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Staff created successfully',
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
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Fetch all staff records
 * @route   GET /api/staff
 * @desc    Retrieve a list of all staff members (Faculty)
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllStaff = async (req, res) => {
  try {
    const result = await staffService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch staff'
          : 'Staff fetched successfully',
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
 * Get staff by account ID
 * @route   GET /api/staff/:id
 * @desc    Retrieve detailed profile data for a specific staff member
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStaffById = async (req, res) => {
  try {
    const result = await staffService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Staff member not found'
          : 'Staff member fetched successfully',
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
 * Update staff profile or role
 * @route   PUT /api/staff/:id
 * @desc    Modify departmental assignment, role, or secondary profile details
 * @access  Admin, Staff (own profile)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateStaff = async (req, res) => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    )
      .toLowerCase()
      .trim();

    const staffResult = await staffService.getById(req.params.id);
    if (
      staffResult.data &&
      (staffResult.data.role === 'admin' ||
        staffResult.data.email?.toLowerCase().trim() === superAdminEmail)
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Super Admin account is protected and cannot be modified.',
        },
        403
      );
    }

    const result = await staffService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message || 'Staff member not found'
          : 'Staff member updated successfully',
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
 * Remove a staff record
 * @route   DELETE /api/staff/:id
 * @desc    Permanently delete a staff member's professional and profile record
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteStaff = async (req, res) => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    )
      .toLowerCase()
      .trim();

    const staffResult = await staffService.getById(req.params.id);
    if (
      staffResult.data &&
      (staffResult.data.role === 'admin' ||
        staffResult.data.email?.toLowerCase().trim() === superAdminEmail)
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Super Admin account is protected and cannot be modified.',
        },
        403
      );
    }

    const result = await staffService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message || 'Staff member not found'
          : 'Staff member deleted successfully',
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
