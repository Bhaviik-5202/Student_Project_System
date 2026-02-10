const { FAQ, SupportTicket, KnowledgeBase } = require("../models/Help");

// FAQ
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch FAQs", error: err.message });
  }
};

// Support Tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().populate("user");
    res.json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch tickets", error: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = new SupportTicket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create ticket", error: err.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update ticket", error: err.message });
  }
};

// Knowledge Base
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await KnowledgeBase.find();
    res.json(articles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch articles", error: err.message });
  }
};
