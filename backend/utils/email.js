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

  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT) || 465;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || user;

  if (!host || process.env.NODE_ENV === 'test') {
    logger.info(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  const isGmail = host && (host.toLowerCase().includes('gmail') || host.toLowerCase().includes('google'));

  const transportConfig = isGmail
    ? {
        service: 'gmail',
        auth: user && pass ? { user, pass } : undefined,
        family: 4,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
          rejectUnauthorized: false,
        },
      }
    : {
        host,
        port,
        secure,
        family: 4, // Force IPv4 connection to prevent ENETUNREACH IPv6 errors on cloud hosts (Render/Vercel)
        connectionTimeout: 10000, // 10s connection timeout
        greetingTimeout: 10000,   // 10s greeting timeout
        socketTimeout: 15000,     // 15s socket timeout
        tls: {
          rejectUnauthorized: false, // Bypass certificate verification errors for self-signed or relay certs
        },
        auth: user && pass ? { user, pass } : undefined,
      };

  const transporter = nodemailer.createTransport(transportConfig);

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email dispatched successfully to ${to}`, { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`, { error });
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

module.exports = sendEmail;
