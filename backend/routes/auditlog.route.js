const express = require("express");
const router = express.Router();

// Controllers and Middlewares
const auditLogController = require("../controllers/auditlog.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * @route   POST /api/v1/audit-logs
 * @desc    Create a new audit log entry
 * @access  Private (Admin Only)
 */
router.post("/", authMiddleware, roleMiddleware(["admin"]), auditLogController.createAuditLog);

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Retrieve all audit log records
 * @access  Private (Admin Only)
 */
router.get("/", authMiddleware, roleMiddleware(["admin"]), auditLogController.getAllAuditLogs);

/**
 * @route   GET /api/v1/audit-logs/:id
 * @desc    Retrieve a single audit log record by ID
 * @access  Private (Admin Only)
 */
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), auditLogController.getAuditLogById);

/**
 * @route   PUT /api/v1/audit-logs/:id
 * @desc    Update an audit log entry
 * @access  Private (Admin Only)
 */
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), auditLogController.updateAuditLog);

/**
 * @route   DELETE /api/v1/audit-logs/:id
 * @desc    Delete an audit log entry
 * @access  Private (Admin Only)
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), auditLogController.deleteAuditLog);

module.exports = router;
