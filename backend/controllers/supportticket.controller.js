const supportTicketService = require("../services/supportticket.service");
const sendResponse = require("../utils/response");

/**
 * Create a new support ticket
 * @route POST /supporttickets
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
          ? "Failed to create support ticket"
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
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get all support tickets
 * @route GET /supporttickets
 * @access Admin, Support
 */
exports.getAllSupportTickets = async (req, res) => {
  try {
    const result = await supportTicketService.getAll();

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
 * Get a support ticket by ID
 * @route GET /supporttickets/:id
 * @access Admin, Support
 */
exports.getSupportTicketById = async (req, res) => {
  try {
    const result = await supportTicketService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Support ticket not found"
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
 * Update a support ticket by ID
 * @route PUT /supporttickets/:id
 * @access Admin, Support
 */
exports.updateSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update support ticket"
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
 * Delete a support ticket by ID
 * @route DELETE /supporttickets/:id
 * @access Admin, Support
 */
exports.deleteSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete support ticket"
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
