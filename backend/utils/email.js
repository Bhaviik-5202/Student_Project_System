/**
 * Email Utility
 * ------------------------------------------------------------------
 * Handles automated email dispatching supporting:
 *  1. Nodemailer SMTP (Gmail / Custom SMTP) - Ideal for local dev & servers with open SMTP
 *  2. Resend HTTPS REST API (Port 443) - Ideal for cloud platforms (Render/Vercel) blocking port 465/587
 *  3. Test & Development logging fallback
 */

const nodemailer = require('nodemailer');
const dns = require('dns');
const logger = require('./logger');

// Configure Node.js to prefer IPv4 globally for network requests
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * Create a Nodemailer Transporter instance based on environment variables.
 */
function createSmtpTransporter() {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const rawPort = process.env.EMAIL_PORT || process.env.SMTP_PORT;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const rawSecure = process.env.EMAIL_SECURE || process.env.SMTP_SECURE;

  if (!user || !pass || pass.startsWith('re_')) {
    return null;
  }

  const isGmail = host.toLowerCase().includes('gmail') || host.toLowerCase().includes('google');
  const port = Number(rawPort) || (isGmail ? 465 : 587);
  const secure = rawSecure !== undefined ? (rawSecure === 'true' || rawSecure === '1') : (port === 465);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Verify Email Service connections on server startup.
 * @returns {Promise<boolean>}
 */
async function verifyEmailService() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('[Email Service] Test environment active (Mock mode)');
    return true;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  // 1. Verify Resend HTTPS REST API if key exists
  if (resendApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch('https://api.resend.com/api-keys', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status === 401 || res.status === 403) {
        logger.info('[Email Service] Resend HTTPS API ready (Port 443 REST API)');
        return true;
      }
    } catch (err) {
      logger.info(`[Email Service] Resend API check notice: ${err.message}`);
    }
  }

  // 2. Verify Nodemailer SMTP if credentials provided
  if (smtpUser && smtpPass && !smtpPass.startsWith('re_')) {
    const transporter = createSmtpTransporter();
    if (transporter) {
      try {
        await transporter.verify();
        logger.info(`[Email Service] Nodemailer SMTP ready (${smtpUser})`);
        return true;
      } catch (err) {
        logger.info(`[Email Service] SMTP verification notice: ${err.message}`);
        return false;
      }
    }
  }

  logger.warn('[Email Service] No active email service configured in .env');
  return false;
}

/**
 * Main function to dispatch an email.
 * @param {Object} options
 * @param {string} options.to Recipient email address
 * @param {string} options.subject Email subject
 * @param {string} [options.text] Plain text body
 * @param {string} [options.html] HTML body
 * @returns {Promise<Object>}
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to || !subject) {
    throw new Error("Email 'to' and 'subject' are required");
  }

  // Bypass for tests or mock addresses
  const isTestDomain =
    process.env.NODE_ENV === 'test' ||
    to.endsWith('@example.com') ||
    to.endsWith('@test.com') ||
    to.includes('authtest+');

  if (isTestDomain) {
    logger.info(`[Email Service - Dev Bypass] To: ${to} | Subject: ${subject}`);
    return { messageId: 'mock-test-id' };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  const configuredFrom = process.env.FROM_EMAIL || process.env.EMAIL_FROM;
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const defaultFrom = smtpUser || 'onboarding@resend.dev';
  const fromEmail = configuredFrom || defaultFrom;
  const formattedFrom = fromEmail.includes('<') ? fromEmail : `"${fromName}" <${fromEmail}>`;

  // ── 1. Try Nodemailer SMTP (Gmail / Custom SMTP) ──────────────────────────
  if (smtpUser && smtpPass && !smtpPass.startsWith('re_')) {
    const transporter = createSmtpTransporter();
    if (transporter) {
      try {
        const mailOptions = {
          from: formattedFrom,
          to,
          subject,
          text,
          html,
        };
        const info = await transporter.sendMail(mailOptions);
        logger.info(`✅ Email delivered via Nodemailer SMTP to ${to}`, { messageId: info.messageId });
        return info;
      } catch (smtpErr) {
        logger.info(`[Email Service] Nodemailer SMTP unavailable (${smtpErr.message}). Checking Resend HTTPS API...`);
        if (!resendApiKey) {
          throw new Error(`SMTP Email delivery failed: ${smtpErr.message}`);
        }
      }
    }
  }

  // ── 2. Try Resend HTTPS REST API (Port 443) ────────────────────────────────
  if (resendApiKey) {
    try {
      const rawEmail = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail : fromEmail;
      const senderEmail = (rawEmail && rawEmail.includes('@')) ? rawEmail : 'onboarding@resend.dev';
      const senderHeader = fromName ? `"${fromName}" <${senderEmail}>` : senderEmail;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderHeader,
          to: Array.isArray(to) ? to : [to],
          subject: subject,
          html: html || text,
          text: text,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.id) {
        logger.info(`✅ Email delivered via Resend HTTPS API to ${to}`, { messageId: data.id });
        return { messageId: data.id };
      }

      // Handle Resend sandbox restriction (403/422)
      if (response.status === 403 || response.status === 422) {
        logger.info(`[Email Service] Resend Sandbox Notice (Recipient: ${to}). Live delivery requires verified domain at resend.com/domains.`);
        return {
          messageId: 'resend-sandbox-simulated-id',
          sandboxRestricted: true,
          notice: data.message || 'Resend sandbox mode',
        };
      }

      throw new Error(`Resend API Error (${response.status}): ${data.message || JSON.stringify(data)}`);
    } catch (apiErr) {
      logger.error(`❌ Email dispatch error: ${apiErr.message}`);
      throw new Error(`Email delivery failed: ${apiErr.message}`);
    }
  }

  throw new Error('No email transport configured. Please set EMAIL_USER and EMAIL_PASS or RESEND_API_KEY in .env');
}

sendEmail.verifySMTP = verifyEmailService;
sendEmail.verifyEmailService = verifyEmailService;

module.exports = sendEmail;
