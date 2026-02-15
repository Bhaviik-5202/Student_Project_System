const knowledgeBaseService = require("../services/knowledgebase.service");
const sendResponse = require("../utils/response");
exports.createKnowledgeBase = async (req, res) => {
  const result = await knowledgeBaseService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllKnowledgeBases = async (req, res) => {
  const result = await knowledgeBaseService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getKnowledgeBaseById = async (req, res) => {
  const result = await knowledgeBaseService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateKnowledgeBase = async (req, res) => {
  const result = await knowledgeBaseService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteKnowledgeBase = async (req, res) => {
  const result = await knowledgeBaseService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
