const Message = require("../models/message.model");

exports.findAll = (filter = {}) => Message.find(filter);
exports.findById = (id) => Message.findById(id);
exports.create = (data) => Message.create(data);
exports.update = (id, data) => Message.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Message.findByIdAndDelete(id);
