const reportService = require('../services/report.service');
const sendResponse = require('../utils/response');

/**
 * Create a new report
 * @route POST /reports
 * @access Authenticated
 * @param {*} req
 * @param {*} res
 */
exports.createReport = async (req, res) => {
  try {
    const reportData = { ...req.body, generatedBy: req.user.id };
    const { error, data, message } =
      await reportService.createReport(reportData);
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data, message }, 201);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Get all reports
 * @route GET /reports
 * @access Admin, User (own reports)
 * @param {*} req
 * @param {*} res
 */
exports.getReports = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { generatedBy: req.user.id };
    const { error, data, message } = await reportService.getAllReports(query);
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data, message }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Delete a report
 * @route DELETE /reports/:id
 * @param {*} req
 * @param {*} res
 */

/**
 * Delete a report by ID
 * @route DELETE /reports/:id
 * @access Admin, Owner
 */
exports.deleteReport = async (req, res) => {
  try {
    const { error, data, message } = await reportService.deleteReport(
      req.params.id
    );
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data, message }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};

/**
 * Update a report
 * @route PUT /reports/:id
 * @param {*} req
 * @param {*} res
 */
/**
 * Update a report by ID
 * @route PUT /reports/:id
 * @access Admin, Owner
 */
exports.updateReport = async (req, res) => {
  try {
    const { error, data, message } = await reportService.updateReport(
      req.params.id,
      req.body
    );
    if (error) throw new Error(message);
    sendResponse(res, { success: true, data, message }, 200);
  } catch (error) {
    sendResponse(res, { success: false, message: error.message }, 500);
  }
};
