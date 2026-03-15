const permissionRepository = require("../repositories/permission.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const permission = await permissionRepository.create(data);
    return response(false, permission, "Permission created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create permission");
  }
};

exports.getAll = async () => {
  try {
    const permissions = await permissionRepository.findAll();
    return response(false, permissions, "Permissions fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch permissions");
  }
};

exports.getById = async (id) => {
  try {
    const permission = await permissionRepository.findById(id);
    if (!permission) return response(true, null, "Permission not found");
    return response(false, permission, "Permission fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch permission");
  }
};

exports.update = async (id, data) => {
  try {
    const permission = await permissionRepository.update(id, data);
    if (!permission) return response(true, null, "Permission not found");
    return response(false, permission, "Permission updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update permission");
  }
};

exports.remove = async (id) => {
  try {
    const permission = await permissionRepository.remove(id);
    if (!permission) return response(true, null, "Permission not found");
    return response(false, null, "Permission deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete permission");
  }
};
