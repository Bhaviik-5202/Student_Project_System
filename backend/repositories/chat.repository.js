const Chat = require("../models/chat.model");

exports.findAll = (filter = {}, options = {}) =>
  Chat.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Chat.findById(id).populate(options.populate || "");

exports.create = (data) => Chat.create(data);

exports.update = (id, data) =>
  Chat.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Chat.findByIdAndDelete(id);
