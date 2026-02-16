const Message = require("../models/message.model");

exports.findAll = (filter = {}, options = {}) =>
  Message.find(filter)
    .sort(options.sort || { createdAt: 1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Message.findById(id).populate(options.populate || "");

exports.create = (data) => Message.create(data);

exports.update = (id, data) =>
  Message.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Message.findByIdAndDelete(id);
