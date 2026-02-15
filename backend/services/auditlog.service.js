const auditLogRepository = require("../repositories/auditlog.repository");

function response(error, data, message) {
  return { error, data, message };
}

/**
 * Create a new audit log entry
 * @param {Object} data - Audit log data
 * @returns {Promise<Object>} Created audit log entry
 */
exports.create = async (data) => {
  try {
    const auditLog = await auditLogRepository.create(data);
    return response(false, auditLog, "Audit log created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create audit log");
  }
};

/**
 * Get all audit log entries
 * @returns {Promise<Array>} List of audit logs
 */
exports.getAll = async () => {
  try {
    const auditLogs = await auditLogRepository.findAll();
    return response(false, auditLogs, "Audit logs fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch audit logs");
  }
};

/**
 * Get an audit log entry by ID
 * @param {string} id - Audit log ID
 * @returns {Promise<Object|null>} Audit log or null
 */
exports.getById = async (id) => {
  try {
    const auditLog = await auditLogRepository.findById(id);
    if (!auditLog) return response(true, null, "Audit log not found");
    return response(false, auditLog, "Audit log fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch audit log");
  }
};

/**
 * Update an audit log entry by ID
 * @param {string} id - Audit log ID
 * @param {Object} data - Update data
 * @returns {Promise<Object|null>} Updated audit log or null
 */
exports.update = async (id, data) => {
  try {
    const auditLog = await auditLogRepository.update(id, data);
    if (!auditLog) return response(true, null, "Audit log not found");
    return response(false, auditLog, "Audit log updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update audit log");
  }
};

/**
 * Delete an audit log entry by ID
 * @param {string} id - Audit log ID
 * @returns {Promise<Object|null>} Deleted audit log or null
 */
exports.remove = async (id) => {
  try {
    const auditLog = await auditLogRepository.remove(id);
    if (!auditLog) return response(true, null, "Audit log not found");
    return response(false, auditLog, "Audit log deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete audit log");
  }
};
