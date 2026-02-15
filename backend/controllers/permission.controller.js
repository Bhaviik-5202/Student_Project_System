const permissionService = require("../services/permission.service");
const sendResponse = require("../utils/response");
exports.createPermission = async (req, res) => {
  const result = await permissionService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllPermissions = async (req, res) => {
  const result = await permissionService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getPermissionById = async (req, res) => {
  const result = await permissionService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updatePermission = async (req, res) => {
  const result = await permissionService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deletePermission = async (req, res) => {
  const result = await permissionService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
