const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const portfolioController = require("../controllers/portfolio.controller");
const auth = require("../middleware/auth.middleware");

// Create portfolio (protected)
router.post(
  "/",
  auth,
  [
    body("student").notEmpty().withMessage("Student is required"),
    body("projects").optional().isArray(),
    body("skills").optional().isArray(),
    body("badges").optional().isArray(),
    body("transcriptUrl").optional().isString(),
  ],
  validateRequest,
  portfolioController.createPortfolio,
);
// Get portfolio by student (protected)
router.get(
  "/student/:studentId",
  auth,
  portfolioController.getPortfolioByStudent,
);
// Update portfolio (protected)
router.put(
  "/:id",
  auth,
  [
    body("projects").optional().isArray(),
    body("skills").optional().isArray(),
    body("badges").optional().isArray(),
    body("transcriptUrl").optional().isString(),
  ],
  validateRequest,
  portfolioController.updatePortfolio,
);

module.exports = router;
