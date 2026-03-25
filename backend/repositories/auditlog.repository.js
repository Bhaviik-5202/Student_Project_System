/**
 * AuditLog Repository
 * Handles direct database access and security event persistence for the AuditLog model.
 */
const AuditLog = require('../models/auditlog.model');

/**
 * Find all audit logs matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - Query options (sort, skip, limit, populate, select)
 * @returns {Promise<Array>} List of audit logs
 */
exports.findAll = (filter = {}, options = {}) =>
  AuditLog.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Locate a single audit log by its unique identifier
 * @param {string} id - Audit log ID
 * @param {Object} options - Query options (populate, select)
 * @returns {Promise<Object|null>} Audit log document or null
 */
exports.findById = (id, options = {}) =>
  AuditLog.findById(id)
    .populate(options.populate || '')
    .select(options.select || '');

/**
 * Persist a new audit log record to the database
 * @param {Object} data - Audit log data object
 * @returns {Promise<Object>} Created audit log document
 */
exports.create = (data) => AuditLog.create(data);

/**
 * Update an existing audit log record
 * @param {string} id - Audit log ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object|null>} Updated audit log document
 */
exports.update = (id, data) =>
  AuditLog.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

/**
 * Delete an audit log record from the database
 * @param {string} id - Audit log ID
 * @returns {Promise<Object|null>} Deleted audit log document
 */
exports.remove = (id) => AuditLog.findByIdAndDelete(id);

/**
 * Count all audit logs matching a specific filter
 * @param {Object} filter - Mongoose filter object
 * @returns {Promise<number>} Record count
 */
exports.count = (filter = {}) => AuditLog.countDocuments(filter);
