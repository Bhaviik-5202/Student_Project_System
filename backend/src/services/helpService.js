const FAQ = require("../models/Help").FAQ;
const SupportTicket = require("../models/Help").SupportTicket;
const KnowledgeBase = require("../models/Help").KnowledgeBase;

exports.getAllFAQs = async () => {
  return FAQ.find();
};

exports.getAllTickets = async () => {
  return SupportTicket.find().populate("user");
};

exports.createTicket = async (data) => {
  const ticket = new SupportTicket(data);
  return ticket.save();
};

exports.updateTicketStatus = async (id, status) => {
  return SupportTicket.findByIdAndUpdate(id, { status }, { new: true });
};

exports.getAllArticles = async () => {
  return KnowledgeBase.find();
};

exports.createArticle = async (data) => {
  const article = new KnowledgeBase(data);
  return article.save();
};

exports.updateArticle = async (id, data) => {
  return KnowledgeBase.findByIdAndUpdate(id, data, { new: true });
};
