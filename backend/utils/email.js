/**
 * Email Utility
 * Handles automated email dispatching via Nodemailer with development logging fallback.
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Dispatch an email message
 * @param {Object} options - Email recipient and content details
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body content
 * @returns {Promise<void>}
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  if (!process.env.EMAIL_HOST || process.env.NODE_ENV === 'test') {
    logger.info(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure = port === 465;

  const transportConfig = {
    host: process.env.EMAIL_HOST,
    port,
    secure,
    tls: {
      rejectUnauthorized: false, // Bypass certificate verification errors (useful for some SMTP relays / self-signed certs)
    },
  };

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transportConfig.auth = {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
