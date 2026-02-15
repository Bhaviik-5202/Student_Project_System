const submissionService = require("../services/submission.service");
const sendResponse = require("../utils/response");
exports.createSubmission = async (req, res) => {
  const result = await submissionService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllSubmissions = async (req, res) => {
  const result = await submissionService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getSubmissionById = async (req, res) => {
  const result = await submissionService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateSubmission = async (req, res) => {
  const result = await submissionService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteSubmission = async (req, res) => {
  const result = await submissionService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
