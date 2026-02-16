const SupportTicket = require("../models/supportticket.model");

exports.findAll = (filter = {}, options = {}) =>
  SupportTicket.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  SupportTicket.findById(id).populate(options.populate || "");

exports.create = (data) => SupportTicket.create(data);

exports.update = (id, data) =>
  SupportTicket.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => SupportTicket.findByIdAndDelete(id);
