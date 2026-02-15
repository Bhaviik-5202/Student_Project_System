const settingService = require("../services/setting.service");
const sendResponse = require("../utils/response");

/**
 * Create a new setting
 * @route POST /settings
 * @access Admin
 */
exports.createSetting = async (req, res) => {
  const result = await settingService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all settings
 * @route GET /settings
 * @access Admin
 */
exports.getAllSettings = async (req, res) => {
  const result = await settingService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a setting by ID
 * @route GET /settings/:id
 * @access Admin
 */
exports.getSettingById = async (req, res) => {
  const result = await settingService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a setting by ID
 * @route PUT /settings/:id
 * @access Admin
 */
exports.updateSetting = async (req, res) => {
  const result = await settingService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a setting by ID
 * @route DELETE /settings/:id
 * @access Admin
 */
exports.deleteSetting = async (req, res) => {
  const result = await settingService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
