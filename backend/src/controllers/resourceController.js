const Resource = require("../models/Resource");

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("uploadedBy");
    res.json(resources);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch resources", error: err.message });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      "uploadedBy",
    );
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch resource", error: err.message });
  }
};

// Upload resource
exports.uploadResource = async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to upload resource", error: err.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete resource", error: err.message });
  }
};
