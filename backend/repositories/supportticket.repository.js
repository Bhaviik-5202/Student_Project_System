const SupportTicket = require("../models/supportticket.model");

exports.findAll = (filter = {}) => SupportTicket.find(filter);
exports.findById = (id) => SupportTicket.findById(id);
exports.create = (data) => SupportTicket.create(data);
exports.update = (id, data) => SupportTicket.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => SupportTicket.findByIdAndDelete(id);
