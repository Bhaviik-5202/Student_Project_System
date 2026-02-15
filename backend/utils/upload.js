/**
 * Utility for handling file uploads using multer.
 * Configures storage engine and exports upload middleware.
 * @module utils/upload
 */
const multer = require("multer");
const path = require("path");

/**
 * Multer storage engine configuration for disk storage.
 * @type {import('multer').StorageEngine}
 */
const storage = multer.diskStorage({
  /**
   * Set the destination folder for uploaded files.
   * @param {Object} req - Express request object
   * @param {Object} file - File object
   * @param {Function} cb - Callback to set destination
   */
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  /**
   * Set the filename for uploaded files.
   * @param {Object} req - Express request object
   * @param {Object} file - File object
   * @param {Function} cb - Callback to set filename
   */
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

/**
 * Multer upload middleware instance.
 * @type {import('multer').Multer}
 */
const upload = multer({ storage });

module.exports = upload;
