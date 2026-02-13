const backupService = require("../services/backupService");
const ApiError = require("../utils/ApiError");

// Get all backups
exports.getAllBackups = async (req, res, next) => {
  try {
    const backups = await backupService.findAll();
    return res.json({ success: true, data: backups });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch backups", [err.message]));
  }
};

// Add backup record (metadata only)
exports.addBackup = async (req, res, next) => {
  try {
    const backup = await backupService.create(req.body);
    return res.status(201).json({ success: true, data: backup });
  } catch (err) {
    return next(new ApiError(400, "Failed to create backup", [err.message]));
  }
};

// Delete backup record (metadata only)
exports.deleteBackup = async (req, res, next) => {
  try {
    const backup = await backupService.remove(req.params.id);
    if (!backup) return next(new ApiError(404, "Backup not found"));
    return res.json({ success: true, message: "Backup deleted" });
  } catch (err) {
    return next(new ApiError(400, "Failed to delete backup", [err.message]));
  }
};
