const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluationController");

// GET /api/evaluation/for/:userId
router.get("/for/:userId", evaluationController.getEvaluationsForUser);
// GET /api/evaluation/by/:userId
router.get("/by/:userId", evaluationController.getEvaluationsByUser);
// POST /api/evaluation
router.post("/", evaluationController.createEvaluation);

module.exports = router;
