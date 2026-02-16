const FAQ = require("../models/faq.model");

exports.findAll = (filter = {}, options = {}) =>
  FAQ.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0);

exports.findById = (id) => FAQ.findById(id);

exports.create = (data) => FAQ.create(data);

exports.update = (id, data) =>
  FAQ.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => FAQ.findByIdAndDelete(id);
