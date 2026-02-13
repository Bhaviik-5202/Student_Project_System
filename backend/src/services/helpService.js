const FAQ = require("../models/Help").FAQ;
const SupportTicket = require("../models/Help").SupportTicket;
const KnowledgeBase = require("../models/Help").KnowledgeBase;

exports.getAllFAQs = async () => FAQ.find();
exports.getAllTickets = async () => SupportTicket.find().populate("user");
exports.createTicket = async (data) => {
  const ticket = new SupportTicket(data);
  return ticket.save();
};
exports.updateTicketStatus = async (id, status) => {
  return SupportTicket.findByIdAndUpdate(id, { status }, { new: true });
};
exports.getAllArticles = async () => KnowledgeBase.find();
