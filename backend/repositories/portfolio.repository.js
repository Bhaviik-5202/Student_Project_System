const Portfolio = require("../models/portfolio.model");

exports.findAll = (filter = {}) => Portfolio.find(filter);
exports.findById = (id) => Portfolio.findById(id);
exports.create = (data) => Portfolio.create(data);
exports.update = (id, data) => Portfolio.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Portfolio.findByIdAndDelete(id);
