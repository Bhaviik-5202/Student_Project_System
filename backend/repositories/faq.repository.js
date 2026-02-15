const FAQ = require("../models/faq.model");

exports.findAll = (filter = {}) => FAQ.find(filter);
exports.findById = (id) => FAQ.findById(id);
exports.create = (data) => FAQ.create(data);
exports.update = (id, data) => FAQ.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => FAQ.findByIdAndDelete(id);
