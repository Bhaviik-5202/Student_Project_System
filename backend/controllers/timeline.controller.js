const timelineService = require("../services/timeline.service");
const sendResponse = require("../utils/response");
exports.createTimeline = async (req, res) => {
  const result = await timelineService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllTimelines = async (req, res) => {
  const result = await timelineService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getTimelineById = async (req, res) => {
  const result = await timelineService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateTimeline = async (req, res) => {
  const result = await timelineService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteTimeline = async (req, res) => {
  const result = await timelineService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
