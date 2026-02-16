/**
 * Staff Routes
 * ------------------------------------------------------------------
 * Handles CRUD operations for staff members.
 * All routes are protected via authentication middleware.
 */

const express = require("express");
const router = express.Router();

// Controller
const staffController = require("../controllers/staff.controller");

// Authentication Middleware
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @route   POST /api/v1/staff
 * @desc    Create a new staff member
 * @access  Private (Authenticated Users)
 */
router.post("/", authMiddleware, staffController.createStaff);

/**
 * @route   GET /api/v1/staff
 * @desc    Retrieve all staff members
 * @access  Private (Authenticated Users)
 */
router.get("/", authMiddleware, staffController.getAllStaff);

/**
 * @route   GET /api/v1/staff/:id
 * @desc    Retrieve a specific staff member by ID
 * @access  Private (Authenticated Users)
 */
router.get("/:id", authMiddleware, staffController.getStaffById);

/**
 * @route   PUT /api/v1/staff/:id
 * @desc    Update an existing staff member
 * @access  Private (Authenticated Users)
 */
router.put("/:id", authMiddleware, staffController.updateStaff);

/**
 * @route   DELETE /api/v1/staff/:id
 * @desc    Delete a staff member
 * @access  Private (Authenticated Users)
 */
router.delete("/:id", authMiddleware, staffController.deleteStaff);

module.exports = router;
