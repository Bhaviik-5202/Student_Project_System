// Health check for CI/CD and monitoring
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, data: null, message: "Health OK" });
});

module.exports = router;
