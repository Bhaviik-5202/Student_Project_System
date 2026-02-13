const auditLogService = require("../services/auditLogService");
const ApiError = require("../utils/ApiError");

// Get all audit logs
exports.getAllAuditLogs = async (req, res, next) => {
  try {
    const logs = await auditLogService.findAll();
    return res.json({ success: true, data: logs });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch audit logs", [err.message]));
  }
};

// Add audit log
exports.addAuditLog = async (req, res, next) => {
  try {
    const log = await auditLogService.create(req.body);
    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    return next(new ApiError(400, "Failed to create audit log", [err.message]));
  }
};
