const KnowledgeBase = require("../models/knowledgebase.model");

exports.findAll = (filter = {}) => KnowledgeBase.find(filter);
exports.findById = (id) => KnowledgeBase.findById(id);
exports.create = (data) => KnowledgeBase.create(data);
exports.update = (id, data) => KnowledgeBase.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => KnowledgeBase.findByIdAndDelete(id);
