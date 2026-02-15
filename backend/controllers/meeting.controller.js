const meetingService = require("../services/meeting.service");
const sendResponse = require("../utils/response");
exports.createMeeting = async (req, res) => {
  const result = await meetingService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllMeetings = async (req, res) => {
  const result = await meetingService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getMeetingById = async (req, res) => {
  const result = await meetingService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateMeeting = async (req, res) => {
  const result = await meetingService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteMeeting = async (req, res) => {
  const result = await meetingService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
