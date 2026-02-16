const KnowledgeBase = require("../models/knowledgebase.model");

exports.findAll = (filter = {}, options = {}) =>
  KnowledgeBase.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0);

exports.findById = (id) => KnowledgeBase.findById(id);

exports.create = (data) => KnowledgeBase.create(data);

exports.update = (id, data) =>
  KnowledgeBase.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => KnowledgeBase.findByIdAndDelete(id);
