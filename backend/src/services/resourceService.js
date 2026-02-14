const Resource = require("../models/Resource");

exports.findAll = async () => {
  return Resource.find().populate("uploadedBy");
};

exports.findById = async (id) => {
  return Resource.findById(id).populate("uploadedBy");
};

exports.create = async (data) => {
  const resource = new Resource(data);
  return resource.save();
};

exports.remove = async (id) => {
  return Resource.findByIdAndDelete(id);
};
