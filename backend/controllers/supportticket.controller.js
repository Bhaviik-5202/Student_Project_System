const supportTicketService = require("../services/supportticket.service");
const sendResponse = require("../utils/response");
exports.createSupportTicket = async (req, res) => {
  const result = await supportTicketService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllSupportTickets = async (req, res) => {
  const result = await supportTicketService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getSupportTicketById = async (req, res) => {
  const result = await supportTicketService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateSupportTicket = async (req, res) => {
  const result = await supportTicketService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteSupportTicket = async (req, res) => {
  const result = await supportTicketService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
