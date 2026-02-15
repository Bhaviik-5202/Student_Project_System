const auditLogRepository = require("../repositories/auditlog.repository");
function response(error, data, message) {
  return { error, data, message };
}
exports.create = async (data) => {
  try {
    const auditLog = await auditLogRepository.create(data);
    return response(false, auditLog, "Audit log created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create audit log");
  }
};
exports.getAll = async () => {
  try {
    const auditLogs = await auditLogRepository.findAll();
    return response(false, auditLogs, "Audit logs fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch audit logs");
  }
};
exports.getById = async (id) => {
  try {
    const auditLog = await auditLogRepository.findById(id);
    if (!auditLog) return response(true, null, "Audit log not found");
    return response(false, auditLog, "Audit log fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch audit log");
  }
};
exports.update = async (id, data) => {
  try {
    const auditLog = await auditLogRepository.update(id, data);
    if (!auditLog) return response(true, null, "Audit log not found");
    return response(false, auditLog, "Audit log updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update audit log");
  }
};
exports.remove = async (id) => {
  try {
    const auditLog = await auditLogRepository.remove(id);
    if (!auditLog) return response(true, null, "Audit log not found");
    return response(false, null, "Audit log deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete audit log");
  }
};
