/**
 * Audit Log Service
 * Business logic layer for system-wide audit logging and security tracking.
 */
const auditLogRepository = require('../repositories/auditlog.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create audit log
 * @param {Object} data - Audit log payload
 * @returns {Promise<Object>} Formatted service response with new log record
 */
exports.create = async (data) => {
  try {
    const auditLog = await auditLogRepository.create(data);
    return response(false, auditLog, 'Audit log created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create audit log');
  }
};

/**
 * Get all audit logs
 * @param {Object} options - Query and pagination options
 * @returns {Promise<Object>} Formatted service response with paginated log list
 */
exports.getAll = async ({ page = 1, limit = 20, filters = {} }) => {
  try {
    const skip = (page - 1) * limit;

    // Transform filters for Mongoose
    const query = {};
    if (filters.action) {
      query.action = { $regex: filters.action, $options: 'i' };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.createdAt) {
      const date = new Date(filters.createdAt);
      if (!isNaN(date.getTime())) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    const [auditLogs, total] = await Promise.all([
      auditLogRepository.findAll(query, {
        skip,
        limit: Number(limit),
        populate: 'user',
      }),
      auditLogRepository.count(query),
    ]);

    return response(
      false,
      {
        logs: auditLogs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      },
      'Audit logs fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch audit logs');
  }
};

/**
 * Get audit log by ID
 * @param {string} id - Audit log identifier
 * @returns {Promise<Object>} Formatted service response with detailed log data
 */
exports.getById = async (id) => {
  try {
    const auditLog = await auditLogRepository.findById(id);
    if (!auditLog) return response(true, null, 'Audit log not found');
    return response(false, auditLog, 'Audit log fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch audit log');
  }
};

/**
 * Update audit log
 * @param {string} id - Audit log identifier
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified log data
 */
exports.update = async (id, data) => {
  try {
    const auditLog = await auditLogRepository.update(id, data);
    if (!auditLog) return response(true, null, 'Audit log not found');
    return response(false, auditLog, 'Audit log updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update audit log');
  }
};

/**
 * Delete audit log
 * @param {string} id - Audit log identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const auditLog = await auditLogRepository.remove(id);
    if (!auditLog) return response(true, null, 'Audit log not found');
    return response(false, null, 'Audit log deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete audit log');
  }
};
