const auditLogService = require("../services/auditlog.service");
const sendResponse = require("../utils/response");

/**
 * Create a new audit log entry
 * @route POST /auditlogs
 * @access Admin
 */
exports.createAuditLog = async (req, res) => {
  const result = await auditLogService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all audit log entries
 * @route GET /auditlogs
 * @access Admin
 */
exports.getAllAuditLogs = async (req, res) => {
  const result = await auditLogService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get an audit log entry by ID
 * @route GET /auditlogs/:id
 * @access Admin
 */
exports.getAuditLogById = async (req, res) => {
  const result = await auditLogService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update an audit log entry by ID
 * @route PUT /auditlogs/:id
 * @access Admin
 */
exports.updateAuditLog = async (req, res) => {
  const result = await auditLogService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete an audit log entry by ID
 * @route DELETE /auditlogs/:id
 * @access Admin
 */
exports.deleteAuditLog = async (req, res) => {
  const result = await auditLogService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
