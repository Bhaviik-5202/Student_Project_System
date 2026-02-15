const Setting = require("../models/setting.model");

exports.findAll = (filter = {}) => Setting.find(filter);
exports.findById = (id) => Setting.findById(id);
exports.create = (data) => Setting.create(data);
exports.update = (id, data) => Setting.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Setting.findByIdAndDelete(id);
