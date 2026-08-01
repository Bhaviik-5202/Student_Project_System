/**
 * Email Utility
 * Handles automated email dispatching via Nodemailer with development logging fallback.
 * Configured with SMTP Port 587 (STARTTLS) and IPv4 preferred lookup for cloud host compatibility.
 */

const nodemailer = require('nodemailer');
const dns = require('dns');
const logger = require('./logger');

// Configure Node.js to prefer IPv4 globally
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const customIPv4Lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { family: 4, hints: dns.ADDRCONFIG }, callback);
};

function resolveIPv4Host(hostname) {
  if (!hostname || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return Promise.resolve(hostname);
  }
  return new Promise((resolve) => {
    dns.lookup(hostname, { family: 4 }, (err, address) => {
      if (err || !address) {
        resolve(hostname);
      } else {
        resolve(address);
      }
    });
  });
}

async function getTransporter() {
  let originalHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const rawPort = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  let user = process.env.SMTP_USER || process.env.EMAIL_USER;
  let pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  const rawSecure = process.env.EMAIL_SECURE || process.env.SMTP_SECURE;

  if (!originalHost || process.env.NODE_ENV === 'test') return null;

  const isGmail = originalHost.toLowerCase().includes('gmail') || originalHost.toLowerCase().includes('google');
  const isSendGrid = originalHost.toLowerCase().includes('sendgrid');
  const isResend = originalHost.toLowerCase().includes('resend') || (pass && pass.startsWith('re_'));

  if (isSendGrid) {
    originalHost = 'smtp.sendgrid.net';
    user = 'apikey'; // SendGrid SMTP authentication strictly requires username 'apikey'
  } else if (isResend) {
    originalHost = 'smtp.resend.com';
    user = 'resend'; // Resend SMTP authentication strictly requires username 'resend'
  }

  // Use port 587 STARTTLS (secure: false) by default for cloud host compatibility (Render/Vercel)
  let port = Number(rawPort) || 587;
  let secure =
    rawSecure !== undefined
      ? rawSecure === 'true' || rawSecure === '1'
      : port === 465;

  if (isGmail || isSendGrid || isResend || port === 465) {
    port = 587;
    secure = false;
  }

  const resolvedHost = await resolveIPv4Host(originalHost);

  const transportConfig = {
    host: resolvedHost,
    port,
    secure,
    family: 4, // Prefer IPv4 to prevent ENETUNREACH IPv6 errors
    lookup: customIPv4Lookup,
    connectionTimeout: 10000, // 10s connection timeout
    greetingTimeout: 10000,   // 10s greeting timeout
    socketTimeout: 15000,     // 15s socket timeout
    tls: {
      servername: originalHost,
      rejectUnauthorized: false, // Bypass certificate verification errors for self-signed or relay certs
    },
  };

  if (user && pass) {
    transportConfig.auth = { user, pass };
  }

  return nodemailer.createTransport(transportConfig);
}

/**
 * Verify SMTP server connection status asynchronously
 * @returns {Promise<boolean>} True if connection verified successfully
 */
async function verifySMTP() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  if (process.env.NODE_ENV === 'test') {
    logger.info('[SMTP] Test environment active (Email logging mode)');
    return true;
  }

  const transporter = await getTransporter();
  if (!transporter) {
    logger.warn('[SMTP] Connection warning: Missing SMTP host configuration');
    return false;
  }

  try {
    await transporter.verify();
    logger.info(`[SMTP] Server Connection Verified Successfully (${host}:587 STARTTLS)`);
    return true;
  } catch (err) {
    logger.error(`[SMTP] Connection Verification Failed (${host}): ${err.message}`, {
      code: err.code,
      command: err.command,
      response: err.response,
      stack: err.stack,
    });
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
 * @returns {Promise<Object>} Nodemailer dispatch info object
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const isResend = (host && host.toLowerCase().includes('resend')) || (pass && pass.startsWith('re_'));
  const defaultFrom = isResend ? 'onboarding@resend.dev' : (user || 'no-reply@studentproject.edu');
  const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM || defaultFrom;
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const from = fromEmail && fromEmail.includes('<') ? fromEmail : `"${fromName}" <${fromEmail}>`;

  const isTestDomain =
    process.env.NODE_ENV === 'test' ||
    !host ||
    to.endsWith('@example.com') ||
    to.endsWith('@test.com') ||
    to.includes('authtest+');

  if (isTestDomain) {
    logger.info(`[DEV/TEST EMAIL Bypassed] To: ${to} | Subject: ${subject}`);
    return { messageId: 'mock-test-id' };
  }

  const transporter = await getTransporter();
  if (!transporter) {
    throw new Error('SMTP Transport is not configured (Missing SMTP host)');
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
    logger.error(`Failed to send email to ${to}: ${error.message}`, {
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack,
    });
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

sendEmail.verifySMTP = verifySMTP;
module.exports = sendEmail;
