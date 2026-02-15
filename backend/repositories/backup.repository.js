const Backup = require("../models/backup.model");

exports.findAll = (filter = {}) => Backup.find(filter);
exports.findById = (id) => Backup.findById(id);
exports.create = (data) => Backup.create(data);
exports.update = (id, data) => Backup.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Backup.findByIdAndDelete(id);
