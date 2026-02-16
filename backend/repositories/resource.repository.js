const Resource = require("../models/resource.model");

exports.findAll = (filter = {}, options = {}) =>
  Resource.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 0)
    .populate(options.populate || "");

exports.findById = (id, options = {}) =>
  Resource.findById(id).populate(options.populate || "");

exports.create = (data) => Resource.create(data);

exports.update = (id, data) =>
  Resource.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

exports.remove = (id) => Resource.findByIdAndDelete(id);
