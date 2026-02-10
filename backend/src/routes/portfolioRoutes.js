const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");

// GET /api/portfolio/:studentId
router.get("/:studentId", portfolioController.getPortfolioByStudent);
// POST /api/portfolio
router.post("/", portfolioController.savePortfolio);

module.exports = router;
