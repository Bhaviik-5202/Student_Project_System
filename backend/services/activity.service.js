const activityRepository = require("../repositories/activity.repository");
function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const activity = await activityRepository.create(data);
    return response(false, activity, "Activity created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create activity");
  }
};

exports.getAll = async () => {
  try {
    const activities = await activityRepository.findAll();
    return response(false, activities, "Activities fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch activities");
  }
};

exports.getById = async (id) => {
  try {
    const activity = await activityRepository.findById(id);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, activity, "Activity fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch activity");
  }
};

exports.update = async (id, data) => {
  try {
    const activity = await activityRepository.update(id, data);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, activity, "Activity updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update activity");
  }
};

exports.remove = async (id) => {
  try {
    const activity = await activityRepository.remove(id);
    if (!activity) return response(true, null, "Activity not found");
    return response(false, null, "Activity deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete activity");
  }
};
