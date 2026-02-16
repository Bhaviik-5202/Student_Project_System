const AuditLog = require("../models/auditlog.model");

exports.findAll = (filter = {}, options = {}) =>
  AuditLog.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  AuditLog.findById(id).populate(options.populate || "");

exports.create = (data) => AuditLog.create(data);

exports.update = (id, data) =>
  AuditLog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => AuditLog.findByIdAndDelete(id);
