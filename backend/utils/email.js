/**
 * Utility for sending emails (stub, replace with nodemailer or similar in production).
 * Logs email details to the console. In production, integrate with a real email provider.
 *
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<void>}
 */
async function sendEmail({ to, subject, text, html }) {
  // Implement with nodemailer or any email service
  // ...existing code...
  // In production, integrate with real email provider
}

module.exports = sendEmail;
