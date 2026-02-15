const supportTicketService = require("../services/supportticket.service");
const sendResponse = require("../utils/response");

/**
 * Create a new support ticket
 * @route POST /supporttickets
 * @access Authenticated
 */
exports.createSupportTicket = async (req, res) => {
  const result = await supportTicketService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all support tickets
 * @route GET /supporttickets
 * @access Admin, Support
 */
exports.getAllSupportTickets = async (req, res) => {
  const result = await supportTicketService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a support ticket by ID
 * @route GET /supporttickets/:id
 * @access Admin, Support
 */
exports.getSupportTicketById = async (req, res) => {
  const result = await supportTicketService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a support ticket by ID
 * @route PUT /supporttickets/:id
 * @access Admin, Support
 */
exports.updateSupportTicket = async (req, res) => {
  const result = await supportTicketService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a support ticket by ID
 * @route DELETE /supporttickets/:id
 * @access Admin, Support
 */
exports.deleteSupportTicket = async (req, res) => {
  const result = await supportTicketService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
