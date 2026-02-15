const Staff = require("../models/staff.model");

exports.findAll = (filter = {}) => Staff.find(filter);
exports.findById = (id) => Staff.findById(id);
exports.create = (data) => Staff.create(data);
exports.update = (id, data) => Staff.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Staff.findByIdAndDelete(id);
