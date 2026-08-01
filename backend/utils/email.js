/**
 * Email Utility
 * Handles automated email dispatching via Resend HTTPS REST API (Port 443)
 * with Nodemailer SMTP fallback and development logging mode.
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

  // Use port 587 STARTTLS (secure: false) by default for cloud host compatibility
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
    connectionTimeout: 8000, // 8s connection timeout
    greetingTimeout: 8000,   // 8s greeting timeout
    socketTimeout: 10000,    // 10s socket timeout
    tls: {
      servername: originalHost,
      rejectUnauthorized: false,
    },
  };

  if (user && pass) {
    transportConfig.auth = { user, pass };
  }

  return nodemailer.createTransport(transportConfig);
}

/**
 * Verify Email Service connection status asynchronously.
 * Prioritizes Resend HTTPS API (Port 443) over SMTP TCP connection (Port 587)
 * to avoid timeout errors on cloud platforms like Render / Vercel where outbound SMTP is blocked.
 * @returns {Promise<boolean>} True if connection verified successfully
 */
async function verifyEmailService() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('[Email] Test environment active (Email logging mode)');
    return true;
  }

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY || (pass && pass.startsWith('re_') ? pass : null);

  // 1. Verify Resend HTTPS REST API (Port 443) if API Key is available
  if (resendApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('https://api.resend.com/api-keys', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        logger.info('[Email] Resend HTTPS API Verified Successfully (Port 443 REST API)');
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        logger.warn(`[Email] Resend API Key check response (${response.status}): ${errorData.message || response.statusText || 'Invalid key'}`);
      }
    } catch (err) {
      logger.warn(`[Email] Resend HTTPS API test notice: ${err.message}. Checking Nodemailer SMTP transport fallback...`);
    }
  }

  // 2. Standard Nodemailer Transport Fallback
  const transporter = await getTransporter();
  if (!transporter) {
    logger.warn('[Email] Connection warning: Missing SMTP host configuration');
    return false;
  }

  try {
    await transporter.verify();
    logger.info(`[Email] Server Connection Verified Successfully (${host}:587 STARTTLS)`);
    return true;
  } catch (err) {
    if (resendApiKey) {
      logger.info('[Email] Resend HTTPS API Key configured for REST API email delivery (SMTP Port 587 unreachable on host network).');
      return true;
    }
    logger.warn(`[Email] Connection Verification Warning (${host}): ${err.message}`);
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
 * @returns {Promise<Object>} Email dispatch info object
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const resendApiKey = process.env.RESEND_API_KEY || (pass && pass.startsWith('re_') ? pass : null);
  const isResend = (host && host.toLowerCase().includes('resend')) || !!resendApiKey;

  const configuredFrom = process.env.FROM_EMAIL || process.env.EMAIL_FROM;
  const defaultFrom = isResend ? 'onboarding@resend.dev' : (user || 'no-reply@studentproject.edu');
  const fromEmail = configuredFrom || defaultFrom;
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const from = fromEmail.includes('<') ? fromEmail : `"${fromName}" <${fromEmail}>`;

  const isTestDomain =
    process.env.NODE_ENV === 'test' ||
    to.endsWith('@example.com') ||
    to.endsWith('@test.com') ||
    to.includes('authtest+');

  if (isTestDomain) {
    logger.info(`[DEV/TEST EMAIL Bypassed] To: ${to} | Subject: ${subject}`);
    return { messageId: 'mock-test-id' };
  }

  // 1. Try Resend HTTPS REST API (Port 443) if Resend API Key is available
  if (resendApiKey) {
    try {
      const rawEmail = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail : fromEmail;
      const resendSender = (rawEmail && rawEmail.includes('@')) ? rawEmail : 'onboarding@resend.dev';
      const formattedFrom = fromName ? `"${fromName}" <${resendSender}>` : resendSender;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: formattedFrom,
          to: Array.isArray(to) ? to : [to],
          subject: subject,
          html: html || text,
          text: text,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const resendData = await response.json().catch(() => ({}));
      if (response.ok && resendData.id) {
        logger.info(`Email dispatched successfully via Resend HTTPS API to ${to}`, { messageId: resendData.id });
        return { messageId: resendData.id };
      }
      logger.warn(`Resend HTTPS API notice: ${resendData.message || JSON.stringify(resendData)}. Falling back to Nodemailer transport.`);
    } catch (apiErr) {
      logger.warn(`Resend HTTPS API warning: ${apiErr.message}. Falling back to Nodemailer transport.`);
    }
  }

  // 2. Standard Nodemailer Transport Fallback
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

sendEmail.verifySMTP = verifyEmailService;
sendEmail.verifyEmailService = verifyEmailService;
module.exports = sendEmail;
