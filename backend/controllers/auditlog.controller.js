const auditLogService = require("../services/auditlog.service");
const sendResponse = require("../utils/response");

/**
 * Create a new audit log entry
 * @route POST /auditlogs
 * @access Admin
 */
exports.createAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create audit log"
          : "Audit log created successfully",
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
 * Get all audit log entries
 * @route GET /auditlogs
 * @access Admin
 */
exports.getAllAuditLogs = async (req, res) => {
  try {
    const result = await auditLogService.getAll();

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
 * Get an audit log entry by ID
 * @route GET /auditlogs/:id
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
 * Update an audit log entry by ID
 * @route PUT /auditlogs/:id
 * @access Admin
 */
exports.updateAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update audit log"
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
 * Delete an audit log entry by ID
 * @route DELETE /auditlogs/:id
 * @access Admin
 */
exports.deleteAuditLog = async (req, res) => {
  try {
    const result = await auditLogService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete audit log"
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
