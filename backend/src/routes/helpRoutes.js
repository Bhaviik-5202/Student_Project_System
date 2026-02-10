const express = require("express");
const router = express.Router();
const helpController = require("../controllers/helpController");

// FAQ
router.get("/faq", helpController.getAllFAQs);
// Support Tickets
router.get("/tickets", helpController.getAllTickets);
router.post("/tickets", helpController.createTicket);
router.patch("/tickets/:id", helpController.updateTicketStatus);
// Knowledge Base
router.get("/articles", helpController.getAllArticles);

module.exports = router;
