const auditLogService = require("../services/auditlog.service");
const sendResponse = require("../utils/response");

/**
 * Audit Log Controller
 * Maintains a secure, immutable record of critical system actions for security and compliance.
 */

/**
 * Fetch all audit logs with pagination and filters
 * @route GET /audit-logs
 * @access Admin
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
          ? "Failed to fetch audit logs"
          : "Audit logs fetched successfully",
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
 * Retrieve a specific audit log entry by its ID
 * @route GET /audit-logs/:id
 * @access Admin
 */
exports.getAuditLogById = async (req, res) => {
  try {
    const result = await auditLogService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Audit log not found"
          : "Audit log fetched successfully",
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
      },
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch resource audit logs"
          : "Resource audit logs fetched successfully",
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
 * Record a new system-level audit entry
 * @route POST /audit-logs
 * @access System, Admin
 */
exports.createAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? result.message : "Audit log entry created",
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
        message: "Failed to create audit log",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Modify an existing audit log (restricted use)
 * @route PUT /audit-logs/:id
 * @access Admin (Super)
 */
exports.updateAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Audit log not found"
          : "Audit log updated successfully",
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
 * Remove an audit log entry from the database
 * @route DELETE /audit-logs/:id
 * @access Admin (Super)
 */
exports.deleteAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Audit log not found"
          : "Audit log deleted successfully",
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
