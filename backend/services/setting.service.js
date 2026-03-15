const settingRepository = require("../repositories/setting.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const setting = await settingRepository.create(data);
    return response(false, setting, "Setting created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create setting");
  }
};

exports.getAll = async () => {
  try {
    const settings = await settingRepository.findAll();
    return response(false, settings, "Settings fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch settings");
  }
};

exports.getById = async (id) => {
  try {
    const setting = await settingRepository.findById(id);
    if (!setting) return response(true, null, "Setting not found");
    return response(false, setting, "Setting fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch setting");
  }
};

exports.update = async (id, data) => {
  try {
    const setting = await settingRepository.update(id, data);
    if (!setting) return response(true, null, "Setting not found");
    return response(false, setting, "Setting updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update setting");
  }
};

exports.remove = async (id) => {
  try {
    const setting = await settingRepository.remove(id);
    if (!setting) return response(true, null, "Setting not found");
    return response(false, null, "Setting deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete setting");
  }
};
