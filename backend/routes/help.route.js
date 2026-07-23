/**
 * Help Routes
 * Serves Help Center endpoints and FAQ content.
 */

const express = require('express');
const router = express.Router();
const helpController = require('../controllers/help.controller');

/**
 * @route GET /api/v1/help/overview
 * @desc  Retrieve Help Center categories, FAQs, and support channels
 * @access Public / Authenticated
 */
router.get('/overview', helpController.getHelpOverview);

/**
 * @route GET /api/v1/help/faqs
 * @desc  Retrieve list of FAQs
 * @access Public / Authenticated
 */
router.get('/faqs', helpController.getFaqs);

/**
 * @route GET /api/v1/help/guide
 * @desc  Retrieve user guide documentation chapters
 * @access Public / Authenticated
 */
router.get('/guide', helpController.getGuide);

module.exports = router;
