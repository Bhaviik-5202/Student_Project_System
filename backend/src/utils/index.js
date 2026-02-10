// utils/index.js
// Central utility exports for backend

const generateToken = require("./generateToken");
const handleAsync = require("./handleAsync");
const sendResponse = require("./sendResponse");
const validateObjectId = require("./validateObjectId");
const paginate = require("./paginate");

module.exports = {
  generateToken,
  handleAsync,
  sendResponse,
  validateObjectId,
  paginate,
};
