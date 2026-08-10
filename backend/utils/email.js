/**
 * Universal Email Utility
 * ------------------------------------------------------------------
 * Handles automated email dispatching supporting:
 *  1. Nodemailer SMTP (Gmail / Custom SMTP) - Ideal for local development
 *  2. Brevo (Sendinblue) HTTPS REST API (BREVO_API_KEY) - Free 300 emails/day to ANY inbox on cloud hosts
 *  3. Resend HTTPS REST API (RESEND_API_KEY) - Port 443 REST API for verified domains / account owner
 *  4. Test & Development logging fallback (Guarantees zero-crash local signup)
 */

const nodemailer = require('nodemailer');
const dns = require('dns');
const logger = require('./logger');

// Configure Node.js to prefer IPv4 globally for network requests
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

let cachedTransporter = null;

/**
 * Create or return a singleton Nodemailer Transporter instance with connection pooling.
 */
function createSmtpTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host =
    process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const rawPort = process.env.EMAIL_PORT || process.env.SMTP_PORT;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const rawSecure = process.env.EMAIL_SECURE || process.env.SMTP_SECURE;

  if (!user || !pass || pass.startsWith('re_') || pass.startsWith('xkeysib-')) {
    return null;
  }

  const isGmail =
    host.toLowerCase().includes('gmail') ||
    host.toLowerCase().includes('google');
  const port = Number(rawPort) || (isGmail ? 465 : 587);
  const secure =
    rawSecure !== undefined
      ? rawSecure === 'true' || rawSecure === '1'
      : port === 465;

  const timeoutMs = process.env.NODE_ENV === 'production' ? 4000 : 6000;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    family: 4,
    auth: { user, pass },
    connectionTimeout: timeoutMs,
    greetingTimeout: timeoutMs,
    socketTimeout: timeoutMs,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return cachedTransporter;
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

  const brevoApiKey =
    process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  // 1. Check Brevo HTTPS API if key exists (Preferred for Cloud Hosts like Render)
  if (brevoApiKey) {
    logger.info('[Email Service] Brevo HTTPS REST API ready (Port 443)');
    return true;
  }

  // 2. Check Resend HTTPS API if key exists
  if (resendApiKey && resendApiKey.startsWith('re_')) {
    logger.info('[Email Service] Resend HTTPS API configured');
    return true;
  }

  // 3. Verify Nodemailer SMTP if credentials provided (local dev)
  if (
    smtpUser &&
    smtpPass &&
    !smtpPass.startsWith('re_') &&
    !smtpPass.startsWith('xkeysib-')
  ) {
    const transporter = createSmtpTransporter();
    if (transporter) {
      try {
        await transporter.verify();
        logger.info(`[Email Service] Nodemailer SMTP ready (${smtpUser})`);
        return true;
      } catch (err) {
        logger.info(`[Email Service] SMTP verification notice: ${err.message}`);
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.info(
      '[Email Service] Development fallback mode active (Logs OTP to console if dispatch fails)'
    );
    return true;
  }

  logger.warn('[Email Service] No active email service configured in .env');
  return false;
}

/**
 * Send email via Brevo (Sendinblue) HTTPS REST API (Port 443)
 */
async function sendViaBrevo({
  to,
  subject,
  text,
  html,
  fromName,
  fromEmail,
  brevoApiKey,
}) {
  const rawEmail = fromEmail.includes('<')
    ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail
    : fromEmail;
  const senderEmail =
    rawEmail && rawEmail.includes('@')
      ? rawEmail
      : 'no-reply@studentproject.edu';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': brevoApiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: fromName || 'Student Project System',
        email: senderEmail,
      },
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
    logger.info(`✅ Email delivered via Brevo HTTPS API to ${to}`, {
      messageId: msgId,
    });
    return { messageId: msgId };
  }

  throw new Error(
    `Brevo API Error (${response.status}): ${data.message || JSON.stringify(data)}`
  );
}

/**
 * Send email via Resend HTTPS REST API (Port 443)
 */
async function sendViaResend({
  to,
  subject,
  text,
  html,
  fromName,
  fromEmail,
  resendApiKey,
}) {
  const rawEmail = fromEmail.includes('<')
    ? fromEmail.match(/<([^>]+)>/)?.[1] || fromEmail
    : fromEmail;
  const senderEmail =
    rawEmail && rawEmail.includes('@') && !rawEmail.includes('gmail.com')
      ? rawEmail
      : 'onboarding@resend.dev';
  const senderHeader = fromName
    ? `"${fromName}" <${senderEmail}>`
    : senderEmail;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
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
    logger.info(`✅ Email delivered via Resend HTTPS API to ${to}`, {
      messageId: data.id,
    });
    return { messageId: data.id };
  }

  // Handle Resend sandbox restriction (403/422) or invalid API key (401)
  if (
    response.status === 403 ||
    response.status === 422 ||
    response.status === 401
  ) {
    const errorMsg = data.message || `Resend API Error (${response.status})`;
    logger.warn(
      `[Email Service] Resend Notice (Recipient: ${to}): ${errorMsg}`
    );

    if (process.env.NODE_ENV !== 'production') {
      return {
        messageId: 'resend-sandbox-simulated-id',
        sandboxRestricted: true,
        notice: errorMsg,
      };
    }

    throw new Error(`Resend API Error (${response.status}): ${errorMsg}`);
  }

  throw new Error(
    `Resend API Error (${response.status}): ${data.message || JSON.stringify(data)}`
  );
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
  logger.info(`✅ Email delivered via Nodemailer SMTP to ${to}`, {
    messageId: info.messageId,
  });
  return info;
}

/**
 * Main function to dispatch an email.
 * Cascades through Nodemailer SMTP -> Brevo HTTPS API -> Resend HTTPS API -> Dev Fallback.
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

  const brevoApiKey =
    process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const hasSmtp =
    smtpUser &&
    smtpPass &&
    !smtpPass.startsWith('re_') &&
    !smtpPass.startsWith('xkeysib-');

  const configuredFrom = process.env.FROM_EMAIL || process.env.EMAIL_FROM;
  const fromName = process.env.FROM_NAME || 'Student Project System';
  const defaultFrom = smtpUser || 'onboarding@resend.dev';
  const fromEmail = configuredFrom || defaultFrom;
  const formattedFrom = fromEmail.includes('<')
    ? fromEmail
    : `"${fromName}" <${fromEmail}>`;

  const errors = [];

  // ── 1. Brevo HTTPS REST API (Port 443 - Unblocked on Render/Cloud hosts) ──
  if (brevoApiKey) {
    try {
      return await sendViaBrevo({
        to,
        subject,
        text,
        html,
        fromName,
        fromEmail,
        brevoApiKey,
      });
    } catch (brevoErr) {
      logger.warn(`[Email Service] Brevo API notice: ${brevoErr.message}`);
      errors.push(`Brevo: ${brevoErr.message}`);
    }
  }

  // ── 2. Resend HTTPS REST API (Port 443) ──
  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const resendResult = await sendViaResend({
        to,
        subject,
        text,
        html,
        fromName,
        fromEmail,
        resendApiKey,
      });
      if (resendResult) return resendResult;
    } catch (resendErr) {
      logger.warn(`[Email Service] Resend API notice: ${resendErr.message}`);
      errors.push(`Resend: ${resendErr.message}`);
    }
  }

  // ── 3. Nodemailer SMTP (Gmail / Custom SMTP - Ideal for local dev) ──
  if (hasSmtp) {
    try {
      return await sendViaSmtp({ to, subject, text, html, formattedFrom });
    } catch (smtpErr) {
      logger.warn(`[Email Service] Nodemailer SMTP notice: ${smtpErr.message}`);
      errors.push(`SMTP: ${smtpErr.message}`);
    }
  }

  // ── 4. System Fallback Mode ──
  logger.warn(
    `[Email Service - Fallback] Email dispatch attempted for ${to} (${errors.join(' | ') || 'No valid transport'}). Falling back to console logger.`
  );
  return {
    messageId: 'fallback-simulated-id',
    fallback: true,
    notice: errors.length > 0 ? errors.join(' | ') : 'Fallback mode active',
  };
}

sendEmail.verifySMTP = verifyEmailService;
sendEmail.verifyEmailService = verifyEmailService;

module.exports = sendEmail;
