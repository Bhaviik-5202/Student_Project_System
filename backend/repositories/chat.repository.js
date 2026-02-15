const Chat = require("../models/chat.model");

exports.findAll = (filter = {}) => Chat.find(filter);
exports.findById = (id) => Chat.findById(id);
exports.create = (data) => Chat.create(data);
exports.update = (id, data) => Chat.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Chat.findByIdAndDelete(id);
