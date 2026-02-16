/**
 * Audit Log Routes
 * ------------------------------------------------------------------
 * Handles audit log management APIs.
 * Used to track system activities and changes.
 * All routes are protected via authentication middleware.
 */

const express = require("express");
const router = express.Router();

// Controller
const auditLogController = require("../controllers/auditlog.controller");

// Authentication Middleware
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @route   POST /api/v1/audit-logs
 * @desc    Create a new audit log entry
 * @access  Private (Authenticated Users / Admin)
 */
router.post("/", authMiddleware, auditLogController.createAuditLog);

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Retrieve all audit log records
 * @access  Private (Authenticated Users / Admin)
 */
router.get("/", authMiddleware, auditLogController.getAllAuditLogs);

/**
 * @route   GET /api/v1/audit-logs/:id
 * @desc    Retrieve a single audit log record by ID
 * @access  Private (Authenticated Users / Admin)
 */
router.get("/:id", authMiddleware, auditLogController.getAuditLogById);

/**
 * @route   PUT /api/v1/audit-logs/:id
 * @desc    Update an audit log entry
 * @access  Private (Authenticated Users / Admin)
 */
router.put("/:id", authMiddleware, auditLogController.updateAuditLog);

/**
 * @route   DELETE /api/v1/audit-logs/:id
 * @desc    Delete an audit log entry
 * @access  Private (Authenticated Users / Admin)
 */
router.delete("/:id", authMiddleware, auditLogController.deleteAuditLog);

module.exports = router;
