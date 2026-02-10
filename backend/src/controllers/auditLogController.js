const AuditLog = require("../models/AuditLog");

// Get all audit logs
exports.getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("user").sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch audit logs", error: err.message });
  }
};

// Add audit log
exports.addAuditLog = async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to add audit log", error: err.message });
  }
};
