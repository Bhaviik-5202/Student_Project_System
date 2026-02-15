const auditLogService = require("../services/auditlog.service");
const sendResponse = require("../utils/response");
exports.createAuditLog = async (req, res) => {
  const result = await auditLogService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllAuditLogs = async (req, res) => {
  const result = await auditLogService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getAuditLogById = async (req, res) => {
  const result = await auditLogService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateAuditLog = async (req, res) => {
  const result = await auditLogService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteAuditLog = async (req, res) => {
  const result = await auditLogService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
