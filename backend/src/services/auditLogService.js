const AuditLog = require("../models/AuditLog");

exports.findAll = async () =>
  AuditLog.find().populate("user").sort({ createdAt: -1 });
exports.create = async (data) => {
  const log = new AuditLog(data);
  return log.save();
};
