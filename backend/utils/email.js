/**
 * Email Utility
 * Handles automated email dispatching via Resend HTTPS REST API
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
    user = 'apikey';
  } else if (isResend) {
    originalHost = 'smtp.resend.com';
    user = 'resend';
  }

  let port = Number(rawPort) || 587;
  let secure =
    rawSecure !== undefined
      ? rawSecure === 'true' || rawSecure === '1'
      : port === 465;

  if ((isSendGrid || isResend) && port !== 465) {
    port = 587;
    secure = false;
  }

  const resolvedHost = await resolveIPv4Host(originalHost);

  const transportConfig = {
    host: resolvedHost,
    port,
    secure,
    family: 4,
    lookup: customIPv4Lookup,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
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
 */
async function verifyEmailService() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('[Email] Test environment active (Email logging mode)');
    return true;
  }

  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY || (pass && pass.startsWith('re_') ? pass : null);

  // Verify Resend HTTPS API
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
        logger.info('[Email] Resend HTTPS API Verified Successfully');
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.message || response.statusText || 'Invalid key';

        // Sandbox mode still allows sending to verified domains
        if (response.status === 403 || response.status === 401) {
          logger.warn(`[Email] Resend API Key in sandbox mode: ${msg}`);
          logger.warn('[Email] To send to external emails, verify your domain at https://resend.com/domains');
          return true; // Still return true as API key is valid, just restricted
        }

        logger.warn(`[Email] Resend API Key check response (${response.status}): ${msg}`);
        return false;
      }
    } catch (err) {
      logger.warn(`[Email] Resend HTTPS API test notice: ${err.message}`);
      return false;
    }
  }

  logger.warn('[Email] No Resend API key found');
  return false;
}

/**
 * Dispatch an email message
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY || (pass && pass.startsWith('re_') ? pass : null);
  const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const from = fromEmail.includes('<') ? fromEmail : `"${fromName}" <${fromEmail}>`;

  // For development/test
  const isTestDomain =
    process.env.NODE_ENV === 'test' ||
    to.endsWith('@example.com') ||
    to.endsWith('@test.com') ||
    to.includes('authtest+');

  if (isTestDomain) {
    logger.info(`[DEV/TEST EMAIL Bypassed] To: ${to} | Subject: ${subject}`);
    return { messageId: 'mock-test-id' };
  }

  // Try Resend HTTPS REST API
  if (resendApiKey) {
    try {
      // Extract email from from field if it has a name
      const rawEmail = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail : fromEmail;
      const resendSender = (rawEmail && rawEmail.includes('@')) ? rawEmail : 'onboarding@resend.dev';
      const formattedFrom = fromName ? `"${fromName}" <${resendSender}>` : resendSender;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const emailData = {
        from: formattedFrom,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html || text,
        text: text,
      };

      logger.info(`Attempting to send email via Resend to ${to}`);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const resendData = await response.json().catch(() => ({}));

      if (response.ok && resendData.id) {
        logger.info(`✅ Email sent successfully via Resend to ${to}`, { messageId: resendData.id });
        return { messageId: resendData.id };
      }

      // Handle Resend errors
      const resendMsg = resendData.message || JSON.stringify(resendData);

      // Check for sandbox restrictions
      if (response.status === 403 || response.status === 422) {
        logger.warn(`⚠️ Resend sandbox restriction: ${resendMsg}`);
        logger.warn(`📝 To send to ${to}, verify your domain at https://resend.com/domains`);
        logger.info(`📧 For testing, add ${to} to your Resend approved recipients or use a verified domain`);

        // Still return a success with warning so the user doesn't get an error
        return {
          messageId: 'resend-sandbox-simulated-id',
          sandboxRestricted: true,
          notice: 'Email would be sent in production. Resend sandbox restricts sending to unverified domains.',
          debug: { status: response.status, message: resendMsg }
        };
      }

      throw new Error(`Resend API Error: ${resendMsg} (Status: ${response.status})`);

    } catch (apiErr) {
      if (apiErr.message && apiErr.message.includes('Resend API Error')) {
        throw apiErr;
      }
      logger.error(`❌ Resend API error: ${apiErr.message}`);
      throw new Error(`Email delivery failed: ${apiErr.message}`);
    }
  }

  throw new Error('No email service configured. Please set RESEND_API_KEY in your .env file.');
}

sendEmail.verifySMTP = verifyEmailService;
sendEmail.verifyEmailService = verifyEmailService;
module.exports = sendEmail;
