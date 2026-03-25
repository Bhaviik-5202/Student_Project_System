const supportTicketService = require('../services/supportticket.service');
const sendResponse = require('../utils/response');

/**
 * SupportTicket Controller
 * Manages user support requests, issue tracking, and technical assistance workflow.
 */

/**
 * Create a support ticket
 * @route   POST /api/support-tickets
 * @desc    Open a new support request for technical or academic assistance
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
          : 'Support ticket created successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to create support ticket',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all support tickets
 * @route   GET /api/support-tickets
 * @desc    Retrieve a paginated list of all support requests with filters
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
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
          ? 'Failed to fetch support tickets'
          : 'Support tickets fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get ticket by ID
 * @route   GET /api/support-tickets/:id
 * @desc    Retrieve detailed information and history for a support ticket
 * @access  Authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSupportTicketById = async (req, res) => {
  try {
    const result = await supportTicketService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Ticket not found'
          : 'Support ticket fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update support ticket
 * @route   PUT /api/support-tickets/:id
 * @desc    Modify ticket status, priority, or administrative notes
 * @access  Admin, Owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Ticket not found'
          : 'Support ticket updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Delete a support ticket
 * @route   DELETE /api/support-tickets/:id
 * @desc    Permanently remove a support ticket record
 * @access  Admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteSupportTicket = async (req, res) => {
  try {
    const result = await supportTicketService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Ticket not found'
          : 'Support ticket deleted successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
