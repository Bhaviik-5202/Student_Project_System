const settingService = require("../services/setting.service");
const sendResponse = require("../utils/response");
exports.createSetting = async (req, res) => {
  const result = await settingService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllSettings = async (req, res) => {
  const result = await settingService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getSettingById = async (req, res) => {
  const result = await settingService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateSetting = async (req, res) => {
  const result = await settingService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteSetting = async (req, res) => {
  const result = await settingService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
