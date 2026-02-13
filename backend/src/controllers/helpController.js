const helpService = require("../services/helpService");
const ApiError = require("../utils/ApiError");

// FAQ
exports.getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await helpService.getAllFAQs();
    return res.json({ success: true, data: faqs });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch FAQs", [err.message]));
  }
};

// Support Tickets
exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await helpService.getAllTickets();
    return res.json({ success: true, data: tickets });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch tickets", [err.message]));
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await helpService.createTicket(req.body);
    return res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    return next(new ApiError(400, "Failed to create ticket", [err.message]));
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await helpService.updateTicketStatus(
      req.params.id,
      req.body.status,
    );
    if (!ticket) return next(new ApiError(404, "Ticket not found"));
    return res.json({ success: true, data: ticket });
  } catch (err) {
    return next(
      new ApiError(400, "Failed to update ticket status", [err.message]),
    );
  }
};

// Knowledge Base
exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await helpService.getAllArticles();
    return res.json({ success: true, data: articles });
  } catch (err) {
    return next(new ApiError(500, "Failed to fetch articles", [err.message]));
  }
};
