const timelineRepository = require("../repositories/timeline.repository");
function response(error, data, message) {
  return { error, data, message };
}
exports.create = async (data) => {
  try {
    const timeline = await timelineRepository.create(data);
    return response(false, timeline, "Timeline created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create timeline");
  }
};
exports.getAll = async () => {
  try {
    const timelines = await timelineRepository.findAll();
    return response(false, timelines, "Timelines fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch timelines");
  }
};
exports.getById = async (id) => {
  try {
    const timeline = await timelineRepository.findById(id);
    if (!timeline) return response(true, null, "Timeline not found");
    return response(false, timeline, "Timeline fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch timeline");
  }
};
exports.update = async (id, data) => {
  try {
    const timeline = await timelineRepository.update(id, data);
    if (!timeline) return response(true, null, "Timeline not found");
    return response(false, timeline, "Timeline updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update timeline");
  }
};
exports.remove = async (id) => {
  try {
    const timeline = await timelineRepository.remove(id);
    if (!timeline) return response(true, null, "Timeline not found");
    return response(false, null, "Timeline deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete timeline");
  }
};
