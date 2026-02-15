const evaluationService = require("../services/evaluation.service");
const sendResponse = require("../utils/response");
exports.createEvaluation = async (req, res) => {
  const result = await evaluationService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllEvaluations = async (req, res) => {
  const result = await evaluationService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getEvaluationById = async (req, res) => {
  const result = await evaluationService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateEvaluation = async (req, res) => {
  const result = await evaluationService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteEvaluation = async (req, res) => {
  const result = await evaluationService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
