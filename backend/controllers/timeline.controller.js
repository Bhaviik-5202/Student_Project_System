const timelineService = require("../services/timeline.service");
const sendResponse = require("../utils/response");

/**
 * Create a new timeline event
 * @route POST /timelines
 * @access Admin, Faculty
 */
exports.createTimeline = async (req, res) => {
  const result = await timelineService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all timeline events
 * @route GET /timelines
 * @access Authenticated
 */
exports.getAllTimelines = async (req, res) => {
  const result = await timelineService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a timeline event by ID
 * @route GET /timelines/:id
 * @access Authenticated
 */
exports.getTimelineById = async (req, res) => {
  const result = await timelineService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a timeline event by ID
 * @route PUT /timelines/:id
 * @access Admin, Faculty
 */
exports.updateTimeline = async (req, res) => {
  const result = await timelineService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a timeline event by ID
 * @route DELETE /timelines/:id
 * @access Admin, Faculty
 */
exports.deleteTimeline = async (req, res) => {
  const result = await timelineService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
