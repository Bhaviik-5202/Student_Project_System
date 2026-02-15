const AuditLog = require("../models/auditlog.model");

exports.findAll = (filter = {}) => AuditLog.find(filter);
exports.findById = (id) => AuditLog.findById(id);
exports.create = (data) => AuditLog.create(data);
exports.update = (id, data) => AuditLog.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => AuditLog.findByIdAndDelete(id);
