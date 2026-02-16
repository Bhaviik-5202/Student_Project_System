const Staff = require("../models/staff.model");

exports.findAll = (filter = {}, options = {}) =>
  Staff.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0);

exports.findById = (id) => Staff.findById(id);

exports.create = (data) => Staff.create(data);

exports.update = (id, data) =>
  Staff.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Staff.findByIdAndDelete(id);
