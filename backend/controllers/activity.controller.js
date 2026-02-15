const activityService = require("../services/activity.service");
const sendResponse = require("../utils/response");
exports.createActivity = async (req, res) => {
  const result = await activityService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllActivities = async (req, res) => {
  const result = await activityService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getActivityById = async (req, res) => {
  const result = await activityService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateActivity = async (req, res) => {
  const result = await activityService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteActivity = async (req, res) => {
  const result = await activityService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
