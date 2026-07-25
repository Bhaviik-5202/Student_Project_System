/**
 * Report Routes
 * Handles generation and management of reports.
 */

const express = require('express');
const router = express.Router();

// Controllers and Middlewares
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all report routes
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'faculty', 'student']));

/**
 * @route   POST /api/v1/reports
 * @desc    Generate and save a new report
 * @access  Private (Admin, Faculty, Student)
 */
router.post('/', reportController.createReport);

/**
 * @route   GET /api/v1/reports
 * @desc    Fetch all reports accessible to user
 * @access  Private (Admin, Faculty, Student)
 */
router.get('/', reportController.getReports);

/**
 * @route   PUT /api/v1/reports/:id
 * @desc    Update a report
 * @access  Private (Admin, Faculty, Student)
 */
router.put('/:id', reportController.updateReport);

/**
 * @route   DELETE /api/v1/reports/:id
 * @desc    Delete a report
 * @access  Private (Admin, Faculty)
 */
router.delete('/:id', roleMiddleware(['admin', 'faculty']), reportController.deleteReport);

module.exports = router;
