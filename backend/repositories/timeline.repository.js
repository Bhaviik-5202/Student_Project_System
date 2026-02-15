const Timeline = require("../models/timeline.model");

exports.findAll = (filter = {}) => Timeline.find(filter);
exports.findById = (id) => Timeline.findById(id);
exports.create = (data) => Timeline.create(data);
exports.update = (id, data) => Timeline.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Timeline.findByIdAndDelete(id);
