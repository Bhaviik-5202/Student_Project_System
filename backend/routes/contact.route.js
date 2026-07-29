const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

router.post('/inquiry', contactController.submitInquiry);
router.post('/feedback', contactController.submitFeedback);

module.exports = router;
