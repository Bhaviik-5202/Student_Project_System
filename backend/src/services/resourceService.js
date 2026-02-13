const Resource = require("../models/Resource");

exports.findAll = async () => Resource.find().populate("uploadedBy");
exports.findById = async (id) => Resource.findById(id).populate("uploadedBy");
exports.create = async (data) => {
  const resource = new Resource(data);
  return resource.save();
};
exports.remove = async (id) => Resource.findByIdAndDelete(id);
