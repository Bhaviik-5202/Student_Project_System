const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");

// GET /api/audit-logs
router.get("/", auditLogController.getAllAuditLogs);
// POST /api/audit-logs
router.post("/", auditLogController.addAuditLog);

module.exports = router;
