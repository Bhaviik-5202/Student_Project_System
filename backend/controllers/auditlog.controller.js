const auditLogService = require('../services/auditlog.service');
const sendResponse = require('../utils/response');

/**
 * Audit Log Controller
 * Maintains a secure, immutable record of critical system actions for security and compliance.
 */

/**
 * Fetch all audit logs
 * @route   GET /api/audit-logs
 * @desc    Retrieve a paginated list of security and operational audit entries
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await auditLogService.getAll({ page, limit, filters });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch audit logs'
          : 'Audit logs fetched successfully',
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
 * Get audit log by ID
 * @route   GET /api/audit-logs/:id
 * @desc    Retrieve detailed information for a specific immutable audit record
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAuditLogById = async (req, res) => {
  try {
    const result = await auditLogService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Audit log not found'
          : 'Audit log fetched successfully',
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
 * Fetch audit history for a specific system resource or entity
 * @route GET /audit-logs/resource/:resourceId
 * @access Admin
 */
exports.getAuditLogsByResourceId = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await auditLogService.getByResourceId(
      req.params.resourceId,
      {
        page,
        limit,
      }
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch resource audit logs'
          : 'Resource audit logs fetched successfully',
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
 * Record an audit entry
 * @route   POST /api/audit-logs
 * @desc    Manually trigger the creation of a system-level audit record
 * @access  System, Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : 'Audit log entry created',
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
        message: 'Failed to create audit log',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Update audit log
 * @route   PUT /api/audit-logs/:id
 * @desc    Limited modification of audit log metadata (Administrative use only)
 * @access  Admin (Super)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Audit log not found'
          : 'Audit log updated successfully',
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
 * Delete an audit log
 * @route   DELETE /api/audit-logs/:id
 * @desc    Permanently remove an audit record from the database
 * @access  Admin (Super)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Audit log not found'
          : 'Audit log deleted successfully',
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
