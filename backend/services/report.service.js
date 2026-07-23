/**
 * Report Service
 * Business logic layer for system report extraction and management.
 */
const Report = require('../models/report.model');

/**
 * Standardized response helper for services
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Create report
 * @param {Object} reportData - Report attribute data
 * @returns {Promise<Object>} Formatted service response with new report instance
 */
exports.createReport = async (reportData) => {
  try {
    const report = new Report(reportData);
    await report.save();
    return response(false, report, 'Report created successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Get all reports
 * @param {Object} query - Filtering criteria
 * @returns {Promise<Object>} Formatted service response with global report list
 */
exports.getAllReports = async (query = {}) => {
  try {
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'name email');
    return response(false, reports, 'Reports fetched successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Delete report
 * @param {string} id - Report identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.deleteReport = async (id) => {
  try {
    const report = await Report.findByIdAndDelete(id);
    if (!report) throw new Error('Report not found');
    return response(false, report, 'Report deleted successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

/**
 * Update report
 * @param {string} id - Report identifier
 * @param {Object} updateData - Attributes to update
 * @returns {Promise<Object>} Formatted service response with modified report data
 */
exports.updateReport = async (id, updateData) => {
  try {
    const report = await Report.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
    });
    if (!report) throw new Error('Report not found');
    return response(false, report, 'Report updated successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};
