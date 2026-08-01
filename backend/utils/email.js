/**
 * Universal Email Utility
 * ------------------------------------------------------------------
 * Handles automated email dispatching supporting:
 *  1. Brevo (Sendinblue) HTTPS REST API (BREVO_API_KEY) - Free 300 emails/day to ANY inbox on cloud hosts
 *  2. Resend HTTPS REST API (RESEND_API_KEY) - Port 443 REST API for verified domains / account owner
 *  3. Nodemailer SMTP (Gmail / Custom SMTP) - Ideal for local development
 *  4. Test & Development logging fallback
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

  if (!user || !pass || pass.startsWith('re_') || pass.startsWith('xkeysib-')) {
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
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 5000,
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

  const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  // 1. Check Brevo HTTPS API if key exists
  if (brevoApiKey) {
    logger.info('[Email Service] Brevo HTTPS REST API ready (Port 443)');
    return true;
  }

  // 2. Check Resend HTTPS API if key exists
  if (resendApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
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

  // 3. Verify Nodemailer SMTP if credentials provided (local dev)
  if (smtpUser && smtpPass && !smtpPass.startsWith('re_') && !smtpPass.startsWith('xkeysib-')) {
    const transporter = createSmtpTransporter();
    if (transporter) {
      try {
        await transporter.verify();
        logger.info(`[Email Service] Nodemailer SMTP ready (${smtpUser})`);
        return true;
      } catch (err) {
        logger.info(`[Email Service] SMTP verification notice: ${err.message}`);
        return !!resendApiKey;
      }
    }
  }

  logger.warn('[Email Service] No active email service configured in .env');
  return false;
}

/**
 * Send email via Brevo (Sendinblue) HTTPS REST API (Port 443)
 */
async function sendViaBrevo({ to, subject, text, html, fromName, fromEmail, brevoApiKey }) {
  const rawEmail = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail : fromEmail;
  const senderEmail = rawEmail && rawEmail.includes('@') ? rawEmail : 'no-reply@studentproject.edu';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': brevoApiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName || 'Student Project System', email: senderEmail },
      to: [{ email: Array.isArray(to) ? to[0] : to }],
      subject: subject,
      htmlContent: html || text,
      textContent: text,
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  const data = await response.json().catch(() => ({}));

  if (response.ok && (data.messageId || data.messageIds)) {
    const msgId = data.messageId || data.messageIds?.[0] || 'brevo-id';
    logger.info(`✅ Email delivered via Brevo HTTPS API to ${to}`, { messageId: msgId });
    return { messageId: msgId };
  }

  throw new Error(`Brevo API Error (${response.status}): ${data.message || JSON.stringify(data)}`);
}

/**
 * Send email via Resend HTTPS REST API (Port 443)
 */
async function sendViaResend({ to, subject, text, html, fromName, fromEmail, resendApiKey }) {
  const rawEmail = fromEmail.includes('<') ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail : fromEmail;
  const senderEmail = (rawEmail && rawEmail.includes('@') && !rawEmail.includes('gmail.com')) ? rawEmail : 'onboarding@resend.dev';
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
    const errorMsg = data.message || 'Resend sandbox restriction: verified domain required at resend.com/domains';
    logger.warn(`[Email Service] Resend Sandbox Restriction (Recipient: ${to}): ${errorMsg}`);
    throw new Error(`Resend API Restriction (${response.status}): ${errorMsg}`);
  }

  throw new Error(`Resend API Error (${response.status}): ${data.message || JSON.stringify(data)}`);
}

/**
 * Send email via Nodemailer SMTP (Port 465/587)
 */
async function sendViaSmtp({ to, subject, text, html, formattedFrom }) {
  const transporter = createSmtpTransporter();
  if (!transporter) {
    throw new Error('Nodemailer SMTP transporter not available');
  }

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
}

/**
 * Main function to dispatch an email.
 * Supports Brevo HTTPS API, Resend HTTPS API, and Nodemailer SMTP.
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

  const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const hasSmtp = smtpUser && smtpPass && !smtpPass.startsWith('re_') && !smtpPass.startsWith('xkeysib-');

  const configuredFrom = process.env.FROM_EMAIL || process.env.EMAIL_FROM;
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const defaultFrom = smtpUser || 'onboarding@resend.dev';
  const fromEmail = configuredFrom || defaultFrom;
  const formattedFrom = fromEmail.includes('<') ? fromEmail : `"${fromName}" <${fromEmail}>`;

  // ── 1. Try Brevo HTTPS API if key present ──────────────────────────────────
  if (brevoApiKey) {
    try {
      return await sendViaBrevo({ to, subject, text, html, fromName, fromEmail, brevoApiKey });
    } catch (brevoErr) {
      logger.warn(`Brevo API error: ${brevoErr.message}. Trying next provider...`);
    }
  }

  // ── 2. Nodemailer SMTP (Gmail / Custom SMTP) if EMAIL_USER and EMAIL_PASS are set ──
  if (hasSmtp) {
    try {
      return await sendViaSmtp({ to, subject, text, html, formattedFrom });
    } catch (smtpErr) {
      if (resendApiKey) {
        logger.info(`[Email Service] Nodemailer SMTP unavailable (${smtpErr.message}). Switching to Resend REST API...`);
        return await sendViaResend({ to, subject, text, html, fromName, fromEmail, resendApiKey });
      }
      throw new Error(`SMTP Email delivery failed: ${smtpErr.message}`);
    }
  }

  // ── 3. Resend HTTPS REST API (Port 443) ──────────────────────────────────
  if (resendApiKey) {
    return await sendViaResend({ to, subject, text, html, fromName, fromEmail, resendApiKey });
  }

  throw new Error('No email transport configured. Please set BREVO_API_KEY, RESEND_API_KEY, or EMAIL_USER/EMAIL_PASS in .env');
}

sendEmail.verifySMTP = verifyEmailService;
sendEmail.verifyEmailService = verifyEmailService;

module.exports = sendEmail;
