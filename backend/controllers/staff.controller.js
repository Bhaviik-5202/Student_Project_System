const staffService = require("../services/staff.service");
const sendResponse = require("../utils/response");
exports.createStaff = async (req, res) => {
  const result = await staffService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};
exports.getAllStaff = async (req, res) => {
  const result = await staffService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};
exports.getStaffById = async (req, res) => {
  const result = await staffService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.updateStaff = async (req, res) => {
  const result = await staffService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};
exports.deleteStaff = async (req, res) => {
  const result = await staffService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
