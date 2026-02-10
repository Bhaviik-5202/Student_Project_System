const Backup = require("../models/Backup");

// Get all backups
exports.getAllBackups = async (req, res) => {
  try {
    const backups = await Backup.find()
      .populate("createdBy")
      .sort({ createdAt: -1 });
    res.json(backups);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch backups", error: err.message });
  }
};

// Add backup record (metadata only)
exports.addBackup = async (req, res) => {
  try {
    const backup = new Backup(req.body);
    await backup.save();
    res.status(201).json(backup);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to add backup", error: err.message });
  }
};

// Delete backup record (metadata only)
exports.deleteBackup = async (req, res) => {
  try {
    const backup = await Backup.findByIdAndDelete(req.params.id);
    if (!backup) return res.status(404).json({ message: "Backup not found" });
    res.json({ message: "Backup deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete backup", error: err.message });
  }
};
