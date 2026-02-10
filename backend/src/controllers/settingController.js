const Setting = require("../models/Setting");

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch settings", error: err.message });
  }
};

// Get setting by key
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) return res.status(404).json({ message: "Setting not found" });
    res.json(setting);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch setting", error: err.message });
  }
};

// Update or create setting
exports.saveSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      setting.updatedAt = new Date();
      await setting.save();
    } else {
      setting = new Setting({ key, value });
      await setting.save();
    }
    res.status(201).json(setting);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to save setting", error: err.message });
  }
};
