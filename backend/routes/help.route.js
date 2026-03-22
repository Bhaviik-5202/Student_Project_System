const express = require('express');
const router = express.Router();
const helpController = require('../controllers/help.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/overview', helpController.getHelpOverview);
router.get('/guide', helpController.getGuide);
router.get('/tutorials', helpController.getTutorials);
router.get('/kb', helpController.getKbData);
router.post('/tickets', helpController.createTicket);

module.exports = router;
