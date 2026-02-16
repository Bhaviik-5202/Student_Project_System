const Portfolio = require("../models/portfolio.model");

exports.findAll = (filter = {}, options = {}) =>
  Portfolio.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Portfolio.findById(id).populate(options.populate || "");

exports.create = (data) => Portfolio.create(data);

exports.update = (id, data) =>
  Portfolio.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Portfolio.findByIdAndDelete(id);
