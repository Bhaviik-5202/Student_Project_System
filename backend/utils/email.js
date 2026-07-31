/**
 * Email Utility
 * Handles automated email dispatching via Nodemailer with development logging fallback.
 * Supports SMTP_HOST / EMAIL_HOST, SMTP_PORT / EMAIL_PORT, SMTP_USER / EMAIL_USER,
 * SMTP_PASS / EMAIL_PASS, FROM_EMAIL / EMAIL_FROM, FROM_NAME.
 */

const nodemailer = require('nodemailer');
const dns = require('dns');
const logger = require('./logger');

// Ensure Node defaults to IPv4 first globally
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const customIPv4Lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { family: 4, hints: dns.ADDRCONFIG }, callback);
};

function getTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!host) return null;

  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1'
      : port === 465;

  const transportConfig = {
    host,
    port,
    secure,
    family: 4, // Force IPv4 connection to prevent ENETUNREACH IPv6 errors on cloud hosts (Render/Vercel)
    lookup: customIPv4Lookup,
    connectionTimeout: 10000, // 10s connection timeout
    greetingTimeout: 10000,   // 10s greeting timeout
    socketTimeout: 15000,     // 15s socket timeout
    tls: {
      rejectUnauthorized: false, // Bypass certificate verification errors for self-signed or relay certs
    },
  };

  if (user && pass) {
    transportConfig.auth = { user, pass };
  }

  return nodemailer.createTransport(transportConfig);
}

/**
 * Verify SMTP server connection status
 * @returns {Promise<boolean>} True if connection verified successfully
 */
async function verifySMTP() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  if (!host || process.env.NODE_ENV === 'test') {
    logger.info('[SMTP] Development / Test environment active (Email logging mode)');
    return true;
  }

  const transporter = getTransporter();
  if (!transporter) {
    logger.warn('[SMTP] Connection warning: Missing SMTP_HOST / EMAIL_HOST');
    return false;
  }

  try {
    await transporter.verify();
    logger.info(`[SMTP] Server Connection Verified Successfully (${host})`);
    return true;
  } catch (err) {
    logger.error(`[SMTP] Connection Verification Failed (${host}): ${err.message}`, { error: err });
    return false;
  }
}

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

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM || user;
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const from = fromEmail && fromEmail.includes('<') ? fromEmail : `"${fromName}" <${fromEmail || 'no-reply@studentproject.edu'}>`;

  if (!host || process.env.NODE_ENV === 'test') {
    logger.info(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }

  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('SMTP Transport is not configured (Missing SMTP_HOST)');
  }

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

sendEmail.verifySMTP = verifySMTP;
module.exports = sendEmail;
