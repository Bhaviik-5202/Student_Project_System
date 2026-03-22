/**
 * Health Check Routes
 * ------------------------------------------------------------------
 * Used for system health monitoring and verification.
 */

const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Verify server health status
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: 'Health OK',
  });
});

module.exports = router;
