const activityService = require("../services/activity.service");
const sendResponse = require("../utils/response");

/**
 * Create a new activity
 * @route POST /activities
 * @access Admin, Faculty
 */
exports.createActivity = async (req, res) => {
  const result = await activityService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all activities
 * @route GET /activities
 * @access Authenticated
 */
exports.getAllActivities = async (req, res) => {
  const result = await activityService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get an activity by ID
 * @route GET /activities/:id
 * @access Authenticated
 */
exports.getActivityById = async (req, res) => {
  const result = await activityService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update an activity by ID
 * @route PUT /activities/:id
 * @access Admin, Faculty
 */
exports.updateActivity = async (req, res) => {
  const result = await activityService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete an activity by ID
 * @route DELETE /activities/:id
 * @access Admin, Faculty
 */
exports.deleteActivity = async (req, res) => {
  const result = await activityService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
