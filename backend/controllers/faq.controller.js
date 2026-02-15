const faqService = require("../services/faq.service");
const sendResponse = require("../utils/response");
exports.createFAQ = async (req, res) => {
  const result = await faqService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllFAQs = async (req, res) => {
  const result = await faqService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getFAQById = async (req, res) => {
  const result = await faqService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateFAQ = async (req, res) => {
  const result = await faqService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteFAQ = async (req, res) => {
  const result = await faqService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
