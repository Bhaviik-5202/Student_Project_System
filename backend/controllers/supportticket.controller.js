const supportTicketService = require("../services/supportticket.service");
const sendResponse = require("../utils/response");

/**
 * SupportTicket Controller
 * Manages user support requests, issue tracking, and technical assistance workflow.
 */

/**
 * Open a new support ticket
 * @route POST /support-tickets
 * @access Authenticated
 */
exports.createSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : "Support ticket created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Failed to create support ticket",
        data: null,
        error: error.message,
      },
      400,
    );
  }
};

/**
 * Fetch all support tickets with pagination and status filters
 * @route GET /support-tickets
 * @access Admin
 */
exports.getAllSupportTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...status } = req.query;
    const result = await supportTicketService.getAll({ page, limit, status });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch support tickets"
          : "Support tickets fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get detailed information for a specific support ticket
 * @route GET /support-tickets/:id
 * @access Authenticated
 */
exports.getSupportTicketById = async (req, res) => {
  try {
    const result = await supportTicketService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Ticket not found"
          : "Support ticket fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Update support ticket status, priority, or comments
 * @route PUT /support-tickets/:id
 * @access Admin, Authenticated (owner)
 */
exports.updateSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Ticket not found"
          : "Support ticket updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Permanently close or remove a support ticket record
 * @route DELETE /support-tickets/:id
 * @access Admin
 */
exports.deleteSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Ticket not found"
          : "Support ticket deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
