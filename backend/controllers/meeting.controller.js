const meetingService = require("../services/meeting.service");
const sendResponse = require("../utils/response");

/**
 * Create a new meeting
 * @route POST /meetings
 * @access Faculty, Admin
 */
exports.createMeeting = async (req, res) => {
  const result = await meetingService.create(req.body);
  sendResponse(res, result, result.error ? 400 : 201);
};

/**
 * Get all meetings
 * @route GET /meetings
 * @access Authenticated
 */
exports.getAllMeetings = async (req, res) => {
  const result = await meetingService.getAll();
  sendResponse(res, result, result.error ? 400 : 200);
};

/**
 * Get a meeting by ID
 * @route GET /meetings/:id
 * @access Authenticated
 */
exports.getMeetingById = async (req, res) => {
  const result = await meetingService.getById(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Update a meeting by ID
 * @route PUT /meetings/:id
 * @access Faculty, Admin
 */
exports.updateMeeting = async (req, res) => {
  const result = await meetingService.update(req.params.id, req.body);
  sendResponse(res, result, result.error ? 404 : 200);
};

/**
 * Delete a meeting by ID
 * @route DELETE /meetings/:id
 * @access Faculty, Admin
 */
exports.deleteMeeting = async (req, res) => {
  const result = await meetingService.remove(req.params.id);
  sendResponse(res, result, result.error ? 404 : 200);
};
