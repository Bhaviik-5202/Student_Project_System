const staffRepository = require("../repositories/staff.repository");
function response(error, data, message) {
  return { error, data, message };
}
exports.create = async (data) => {
  try {
    const staff = await staffRepository.create(data);
    return response(false, staff, "Staff created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create staff");
  }
};
exports.getAll = async () => {
  try {
    const staff = await staffRepository.findAll();
    return response(false, staff, "Staff fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch staff");
  }
};
exports.getById = async (id) => {
  try {
    const staff = await staffRepository.findById(id);
    if (!staff) return response(true, null, "Staff not found");
    return response(false, staff, "Staff fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch staff");
  }
};
exports.update = async (id, data) => {
  try {
    const staff = await staffRepository.update(id, data);
    if (!staff) return response(true, null, "Staff not found");
    return response(false, staff, "Staff updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update staff");
  }
};
exports.remove = async (id) => {
  try {
    const staff = await staffRepository.remove(id);
    if (!staff) return response(true, null, "Staff not found");
    return response(false, null, "Staff deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete staff");
  }
};
