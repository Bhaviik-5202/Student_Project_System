const Setting = require("../models/Setting");
const ApiError = require("../utils/ApiError");
const handleAsync = require("../utils/handleAsync");

// Get all settings
exports.getAllSettings = handleAsync(async (req, res) => {
  const settings = await Setting.find();
  return res.json({ success: true, data: settings });
});

// Get setting by key
exports.getSettingByKey = handleAsync(async (req, res, next) => {
  const setting = await Setting.findOne({ key: req.params.key });
  if (!setting) return next(new ApiError(404, "Setting not found"));
  return res.json({ success: true, data: setting });
});

// Update or create setting
exports.saveSetting = handleAsync(async (req, res) => {
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
  return res.status(201).json({ success: true, data: setting });
});
