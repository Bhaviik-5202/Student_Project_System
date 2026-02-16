const Meeting = require("../models/meeting.model");

exports.findAll = (filter = {}, options = {}) =>
  Meeting.find(filter)
    .sort(options.sort || { date: 1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Meeting.findById(id).populate(options.populate || "");

exports.create = (data) => Meeting.create(data);

exports.update = (id, data) =>
  Meeting.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Meeting.findByIdAndDelete(id);
