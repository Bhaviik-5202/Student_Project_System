// utils/sendResponse.js
// Utility to standardize API responses

function sendResponse(
  res,
  { status = 200, success = true, message = "", data = null },
) {
  res.status(status).json({ success, message, data });
}

module.exports = sendResponse;
