const Report = require('../models/report.model');

const response = (error, data, message) => ({ error, data, message });

exports.createReport = async (reportData) => {
  try {
    const report = new Report(reportData);
    await report.save();
    return response(false, report, 'Report created successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

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

exports.deleteReport = async (id) => {
  try {
    const report = await Report.findByIdAndDelete(id);
    if (!report) throw new Error('Report not found');
    return response(false, report, 'Report deleted successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};

exports.updateReport = async (id, updateData) => {
  try {
    const report = await Report.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!report) throw new Error('Report not found');
    return response(false, report, 'Report updated successfully');
  } catch (err) {
    return response(true, null, err.message);
  }
};
